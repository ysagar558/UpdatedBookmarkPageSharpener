// src/Modal.js
import React from "react";
import ReactDOM from "react-dom";
import "./Styles.css";

// Access the API key from your environment variables
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  url,
  setTitle,
  setUrl,
  isEditing,
}) {
  if (!isOpen) return null;

  // ---------- GEMINI AI FEATURE (Suggest Title) ----------
  const generateTitle = async () => {
    if (!url) {
      alert("Enter URL first!");
      return;
    }
    
    // Check for API key presence
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not found in environment variables.");
      alert("AI feature not configured. Check the console for instructions.");
      return;
    }

    try {
      const response = await fetch(
        // Using gemini-2.5-flash for a fast title suggestion
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    // The prompt passed to the model
                    text: `Generate a short, concise, and professional bookmark title for this URL: ${url}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      // Safely extract the suggested title
      const aiTitle = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setTitle(aiTitle.trim().replace(/^['"]|['"]$/g, '')); // Update the title state
    } catch (error) {
      console.error("AI Error:", error);
      alert("An error occurred while generating the title.");
    }
  };

  return ReactDOM.createPortal(
    <div className="overlay">
      <div className="modal">
        <h2>{isEditing ? "Edit Bookmark" : "Add Bookmark"}</h2>

        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} />

        {/* AI Button - New feature */}
        <button className="ai-btn" onClick={generateTitle}>
          Suggest Title (AI)
        </button>

        {/* Submit */}
        <button className="submit-btn" onClick={onSubmit}>
          {isEditing ? "Update" : "Add"}
        </button>

        {/* Close */}
        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>,
    document.getElementById("modal-root") // Assuming you have a div with id="modal-root" in your index.html
  );
}
