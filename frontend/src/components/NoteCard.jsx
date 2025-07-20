// NoteCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NoteCard = ({ note, isSelected, onSelect }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent navigation if the click was on the checkbox
    if (e.target.type === "checkbox") return;
    navigate(`/edit/${note.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition h-48 flex flex-col justify-between relative ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(note.id)}
        className="absolute top-2 right-2 w-4 h-4 cursor-pointer z-10"
        onClick={(e) => e.stopPropagation()}
      />

      <div>
        <h2 className="text-lg font-semibold mb-1 truncate">{note.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-3">{note.content}</p>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(note.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default NoteCard;
