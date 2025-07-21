// components/Sidebar.jsx
import React, { useState } from "react";

const Sidebar = ({ tags, onSelectTag }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-white h-screen shadow-md p-4 transition-all duration-400 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <h2 className="text-lg font-semibold">Second Brain</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-800"
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>

      {!collapsed && (
        <ul className="space-y-2 text-sm">
          <li
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => onSelectTag("ALL")}
          >
            All Notes
          </li>
          {tags.map((tag, i) => (
            <li
              key={i}
              onClick={() => onSelectTag(tag)}
              className="cursor-pointer hover:underline text-gray-700"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
