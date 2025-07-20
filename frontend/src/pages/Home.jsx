// Home.jsx
import React, { useEffect, useState } from 'react';
import NoteList from '../components/NoteList';
import { getAllNotes, searchNotes, getMultiNoteSummary } from '../api/note';
import { useNavigate } from "react-router-dom";
import SummarySidebar from '../components/SummarySidebar';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    getAllNotes().then((data) => {
      setNotes(data || []);
      setFilteredNotes(data || []);  // initially all
    });
  }, []);
  
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    if (query=='') return;
    const ids = await searchNotes(query); // query is in the state
    const matchedNotes = notes.filter(note => ids.includes(note.id));
    setFilteredNotes(matchedNotes);
  };

  const toggleSelectNote = (noteId) => {
    setSelectedNoteIds((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  };

  const handleSummarizeSelected = async () => {
    if (selectedNoteIds.length === 0) return;
    setIsSidebarOpen(true);
    const res = await getMultiNoteSummary(selectedNoteIds);
    setSummary(res.summary);
    
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* 🔍 Search bar */}
        <form onSubmit={handleSearch} className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search your notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
          <button
          onClick={handleSummarizeSelected}
          disabled={selectedNoteIds.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Summarize Selected
        </button>
        </form>

        <NoteList notes={filteredNotes ?? notes}  selectedNoteIds={selectedNoteIds} onToggleSelect={toggleSelectNote}/>
      </div>

      <SummarySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        summary={summary}
      />


      {/* ➕ Floating Add Note Button */}
      <div className="relative">
        <button
          onClick={() => navigate("/new")}
          className="fixed bottom-6 right-6 bg-blue-400 text-white p-6 rounded-full shadow-lg hover:bg-blue-500 transition"
          title="Add Note"
        >
          +
        </button>
      </div>
    </>
  );
};

export default Home;