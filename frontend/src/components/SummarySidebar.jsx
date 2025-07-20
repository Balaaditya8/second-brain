// components/SummarySidebar.jsx
import React from "react";
import { X } from "lucide-react";

const SummarySidebar = ({ isOpen, onClose, summary, title = "Summary" }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose}>
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-3.5rem)] text-sm whitespace-pre-wrap">
        {summary ? summary : <div className="text-gray-500">Loading......</div>}
      </div>
    </div>
  );
};

export default SummarySidebar;
