import React, { useState } from "react";
import { addNote } from "../api/note";
import { useNavigate } from "react-router-dom";

const AddNotePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    await addNote({ title, content });
    navigate("/"); // Redirect to home
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <input
        className="w-full border border-gray-300 p-2 rounded mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border border-gray-300 p-2 rounded h-40 mb-4"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:underline"
        >
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

export default AddNotePage;
