// EditNotePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById, updateNote, deleteNote, getNoteSummary } from "../api/note";
import SummarySidebar from "../components/SummarySidebar";
import TagEditor from "../components/TagEditor";
import ChatSidebar from "../components/ChatSidebar";

const EditNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      const data = await getNoteById(id);
      setNote(data);
      setTitle(data.title);
      setContent(data.content);
      setTags(
        data.tags
          ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : []
      );
    };
    fetchNote();
  }, [id]);

  const handleSave = async () => {
    await updateNote(id, { title, content, tags: tags.join(", "), });
    navigate("/");
  };

  const handleDelete = async () => {
    await deleteNote(id);
    navigate("/");
  }

  const handleSummarize = async () => {
    setIsSidebarOpen(true);
    const response = await getNoteSummary(id); // call your backend with note_id
    setSummary(response.summary || "No summary available");
    
  };

  if (!note)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-4 text-xl font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />

        <textarea
          className="w-full border border-gray-300 rounded-md p-4 text-base h-60 shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
        />

        {/* 🏷️ Tag Editor */}
        <div>
          <label className="text-sm font-medium text-gray-700">Tags</label>
          <TagEditor tags={tags} setTags={setTags} />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>

          <button
            onClick={handleSummarize}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
            >
            Summarize
            </button>
        </div>
      </div>
      <SummarySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        summary={summary}
        title={`Summary of "${title}"`}
        />


        {/* Chat toggle button */}
              <button
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
                onClick={() => setChatOpen(true)}
              >
                💬
              </button>
        
              <ChatSidebar isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>

    
  );
};

export default EditNotePage;
