// Home.jsx
import React, { useEffect, useState } from 'react';
import NoteList from '../components/NoteList';
import { getAllNotes, searchNotes, getMultiNoteSummary } from '../api/note';
import { useNavigate } from "react-router-dom";
import SummarySidebar from '../components/SummarySidebar';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allTags, setAllTags] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    getAllNotes().then((data) => {
      const cleaned = data || [];
      setNotes(cleaned);
      setFilteredNotes(cleaned);

      const tagSet = new Set();
      cleaned.forEach(note => {
        if (note.tags) {
          note.tags.split(",").forEach(tag => tagSet.add(tag.trim()));
        }
      });
      setAllTags([...tagSet]);
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

  const handleSelectTag = (tag) => {
    if (tag === "ALL") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.tags?.toLowerCase().includes(tag.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  const groupNotesByMonth = (notesArray) => {
    const grouped = {};
    notesArray.forEach((note) => {
      const date = new Date(note.created_at);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(note);
    });
    return grouped;
  };

  const renderGroupedNotes = () => {
    if (!filteredNotes.length) {
      return (
        <p className="text-gray-500 text-center mt-10">No notes found.</p>
      );
    }

    const sorted = [...filteredNotes].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const recentNotes = sorted.slice(0, 3);
    const remainingNotes = sorted.slice(3);
    const monthlyGroups = groupNotesByMonth(remainingNotes);

    return (
      <>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Recent</h2>
          <NoteList
            notes={recentNotes}
            selectedNoteIds={selectedNoteIds}
            onToggleSelect={toggleSelectNote}
          />
        </div>

        {Object.entries(monthlyGroups).map(([month, notes]) => (
          <div key={month} className="mb-10">
            <h3 className="text-lg font-semibold mb-2">{month}</h3>
            <NoteList
              notes={notes}
              selectedNoteIds={selectedNoteIds}
              onToggleSelect={toggleSelectNote}
            />
          </div>
        ))}
      </>
    );
  };



  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar tags={allTags} onSelectTag={handleSelectTag} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Search + Summarize */}
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

        {/* Notes */}
        {renderGroupedNotes()}

        {/* Floating Add */}
        <button
          onClick={() => navigate("/new")}
          className="fixed bottom-6 right-6 bg-blue-400 text-white p-6 rounded-full shadow-lg hover:bg-blue-500 transition"
          title="Add Note"
        >
          +
        </button>
      </div>

      {/* Summary Sidebar */}
      <SummarySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        summary={summary}
      />
    </div>
  );
};

export default Home;