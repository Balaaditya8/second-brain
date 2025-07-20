import chromadb

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(name="notes")

def add_embedding(note_id, embedding, metadata, document_text):
    collection.add(
        ids=[str(note_id)],
        embeddings=[embedding],
        documents=[document_text],
        metadatas=[metadata]
    )

def search_similar_notes(query_embedding, top_k=2):
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results