import React, { useState } from "react";

const TagEditor = ({ tags, setTags }) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    const cleaned = newTag.trim();
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (index) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setTags(updated);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center"
        >
          <span>{tag}</span>
          <button
            onClick={() => handleRemoveTag(index)}
            className="ml-2 text-gray-600 hover:text-red-500"
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && newTag.trim() !== "") {
            e.preventDefault();
            handleAddTag();
          }
        }}
        className="border border-gray-300 px-2 py-1 rounded-md text-sm"
        placeholder="Add tag"
      />
    </div>
  );
};

export default TagEditor;
