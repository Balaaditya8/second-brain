import React, { useState } from "react";
import { updateNote } from "../api/note";

const NoteEditor = ({ note, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = async () => {
    await updateNote(note.id, { title, content });
    onClose(); // refresh could be added here too
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Note</h2>
      <input
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="text-gray-600 hover:underline">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
