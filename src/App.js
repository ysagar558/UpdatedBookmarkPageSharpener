// src/App.js
import React from "react";
import Modal from "./Modal";
import { useBookmarks } from "./BookmarkContext"; // Import the custom hook
import "./Styles.css";

// No more state or handlers here! Everything is in BookmarkContext.js

export default function App() {
  // Use the custom hook to access all necessary state and functions
  const {
    bookmarks,
    modalOpen,
    title,
    url,
    editingId,
    handleDelete,
    openAddModal,
    openEditModal,
    closeModal,
    onSubmit,
    isEditing, 
    setTitle, 
    setUrl
  } = useBookmarks();

  return (
    <div className="container">
      <h1>Bookmark Manager</h1>

      <button className="add-btn" onClick={openAddModal}>
        Add New
      </button>

      <h2>All Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        bookmarks.map((b) => (
          <div key={b._id} className="item">
            <div>
              <strong>{b.title}</strong> <br />
              <a href={b.url} target="_blank" rel="noopener noreferrer">
                {b.url}
              </a>
            </div>

            <div>
              <button className="edit-btn" onClick={() => openEditModal(b)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(b._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pass the state and handlers down to the Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={title}
        setTitle={setTitle}
        url={url}
        setUrl={setUrl}
        onSubmit={onSubmit}
        isEditing={isEditing}
      />
    </div>
  );
}