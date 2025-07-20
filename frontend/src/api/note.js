export async function getAllNotes() {
    const res = await fetch("http://127.0.0.1:5000/notes");
    const data = await res.json()
    return data
}

export async function addNote(data) {
    const res = await fetch("http://127.0.0.1:5000/note", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json()
}

export async function updateNote(id, data) {
    const res = await fetch(`http://127.0.0.1:5000/note/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

export async function getNoteById(id) {
    const res = await fetch(`http://127.0.0.1:5000/getnote?id=${id}`)
    return res.json()
}

export const searchNotes = async (query) => {
    const response = await fetch("http://127.0.0.1:5000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data.ids; 
  };
  
export async function deleteNote(id) {
    const res = await fetch(`http://127.0.0.1:5000/note/${id}`, {
    method: "DELETE",
    });
    return res.json();
  }

export async function getNoteSummary(id) {
    const response = await fetch(`http://127.0.0.1:5000/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "note_id": id })
        });
    const data = await response.json();
    return data;
}



export async function getMultiNoteSummary(id) {
    const response = await fetch(`http://127.0.0.1:5000/summarize-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "note_ids": id })
        });
    const data = await response.json();
    return data;
}