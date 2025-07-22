// components/Sidebar.jsx
import React, { useState } from "react";
import { PlusIcon, PencilIcon, PencilSquareIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon,ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ tags, onSelectTag }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white h-screen shadow-md p-4 transition-all duration-400 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <h2 className="text-lg font-semibold">Second Brain</h2>}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-800"
        >
          {collapsed ? <ChevronDoubleRightIcon className="h-5 w-9" /> : <ChevronDoubleLeftIcon className="h-5 w-5" />}
        </div>
      </div>

      {/* Add Note */}
      <div
        onClick={() => navigate("/new")}
        className="flex items-center cursor-pointer mb-4 p-2 hover:bg-blue-100 rounded text-blue-600"
        title="Add Note"
      >
        <PencilIcon className="h-5 w-5" />
        {!collapsed && <span className="ml-2">Add Note</span>}
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
