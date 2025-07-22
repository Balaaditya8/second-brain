from flask import Flask, request, jsonify
from flask_cors import CORS
from db import init_db, insert_note, get_all_notes, get_note_by_id, update_note_by_id, delete_note_by_id
from embeddings import get_embedding
from vector_store import add_embedding, search_similar_notes
import ollama

app = Flask(__name__)
CORS(app)
init_db()

@app.route('/note', methods = ["POST"])
def add_note():
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")
    tags = generate_tags_from_text(title + "\n" + content) 
    note_id = insert_note(title, content, tags)
    embeddings = get_embedding(content)
    metadata = {
        "title": title,
        "tags" : tags,
        "note_id": note_id
    }
    add_embedding(note_id, embeddings, metadata, content)
    return jsonify({"message": "Note saved", "note_id": note_id})

@app.route('/notes', methods=['GET'])
def get_notes():
    rows = get_all_notes()
    notes = []
    for row in rows:
        notes.append({"id":row[0],"title": row[1],"content": row[2],"tags": row[3], "created_at": row[4]})
    return jsonify(notes)


@app.route('/getnote', methods=['GET'])
def get_node_id():
    note_id = request.args.get("id")
    row = get_note_by_id(note_id)
    note = {"id":row[0],"title": row[1],"content": row[2],"tags": row[3], "created_at": row[4]}
    return jsonify(note)

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get("query")
    query_embedding = get_embedding(query)
    results = search_similar_notes(query_embedding, top_k=3)

    matches = []
    for id, score in zip(results["ids"][0], results["distances"][0]):
        matches.append(int(id))
    return jsonify({"ids": matches})

@app.route('/note/<int:note_id>', methods=['PUT'])
def update_note_route(note_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    tags = data.get('tags')
    result = update_note_by_id(title,content, note_id, tags)
    return jsonify({"message": "Note saved", "note_id": note_id})

@app.route('/note/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    print(note_id)
    delete_note_by_id(note_id)
    return jsonify({"message": "Note deleted", "note_id": note_id})

@app.route("/summarize", methods=['POST'])
def summarize_note():
    data = request.json
    note_id = data.get('note_id')
    note = get_note_by_id(note_id)
    title = note[1]
    content = note[2]

    response = ollama.chat(
        model="mistral",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that summarizes personal notes in a concise and insightful way."
            },
            {
                "role": "user",
                "content": f"Please summarize the following note:\n\n{title}\n\n{content}"
            }
        ]
    )
    summary = response['message']['content']
    return jsonify({'summary': summary})

@app.route("/summarize-multiple", methods=["POST"])
def summarize_multiple_notes():
    data = request.json
    note_ids = data.get('note_ids',[])
    content = ''
    for id in note_ids:
        note = get_note_by_id(id)
        content += 'Title:' + note[1] + ' Content:' + note[2] + '\n'

    response = ollama.chat(
        model="mistral",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that summarizes a collection of personal notes in a concise and insightful way. The content maybe from different notes, so you effectively summarizes them"
            },
            {
                "role": "user",
                "content": f"Please summarize the following notes:\n\n{content}"
            }
        ]
    )
    summary = response['message']['content']
    return jsonify({'summary': summary})

def generate_tags_from_text(text):
    response = ollama.chat(
        model="mistral",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that generates 3 to 5 simple tags suitable for given content and returns the tags only in comma separated format"
            },
            {
                "role": "user",
                "content": f"Please generate 3 to 5 tags for given content:\n\n{text} \n Return the generated tags in comma separated format"
            }
        ]
    )
    tags = response['message']['content']
    print(tags)
    return tags

@app.route('/rag-chat', methods=['POST'])
def rag_chat():
    data = request.get_json()
    messages = data.get("messages")
    user_query = next((msg["content"] for msg in reversed(messages) if msg["role"] == "user"), "")

    query_embedding = get_embedding(user_query)
    results = search_similar_notes(query_embedding, top_k=3)

    matched_ids = results["ids"][0]
    print(matched_ids)
    context_notes = []
    for note_id in matched_ids:
        note = get_note_by_id(note_id)
        if note:
            context_notes.append(note)
    print(context_notes)
    context_text = "\n\n---\n\n".join(
        f"Title: {note[1]}\nContent: {note[2]}" for note in context_notes
    )
    print(context_text)
    context_message = {
        "role": "system",
        "content": f"""You are a helpful assistant used in a note taking app. Base your answers on the following notes that were pulled up by a RAG system. Neglect the unnecessary content in the text if not related to the given query:\n\n{context_text}"""
    }

    ollama_messages = [context_message] + messages[-5:]

    response = ollama.chat(model="mistral", messages=ollama_messages)
    return jsonify({"response": response["message"]["content"]})

if __name__ == '__main__':
    app.run(debug=True)