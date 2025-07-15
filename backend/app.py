from flask import Flask, request, jsonify
from flask_cors import CORS
from db import init_db, insert_note, get_all_notes, get_note_by_id


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
init_db()

@app.route('/note', methods = ["POST"])
def add_note():
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")
    tags = ','.join(data.get('tags', []))

    note_id = insert_note(title, content, tags)
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
if __name__ == '__main__':
    app.run(debug=True)