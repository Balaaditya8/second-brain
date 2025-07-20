// NoteList.jsx
import React from "react";
import NoteCard from "./NoteCard";

const NoteList = ({ notes, selectedNoteIds, onToggleSelect }) => {
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} isSelected={selectedNoteIds.includes(note.id)} onSelect={onToggleSelect} />
      ))}
    </div>
    </>
  );
};

export default NoteList;