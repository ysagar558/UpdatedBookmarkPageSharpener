// src/BookmarkContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create the Context
const BookmarkContext = createContext();

// The API URL from App.js
// NOTE: I kept the original ID. You may need to update this if your API key has expired.
const API_URL = "https://crudcrud.com/api/3c0f7b77588b444f95841e1090313503/bookmarks";

// 2. Create the Provider Component (Central State and Logic)
export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load bookmarks from API on mount
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setBookmarks(data))
      .catch(console.error);
  }, []);

  // ---------------------- CRUD Handlers ----------------------
  const handleAdd = async () => {
    if (!title || !url) {
      alert("Please fill all fields");
      return;
    }

    const newBookmark = { title, url };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBookmark),
    });

    const saved = await res.json();
    setBookmarks((prev) => [...prev, saved]);
    closeModal();
  };

  const handleUpdate = async () => {
    if (!title || !url) {
      alert("Please fill all fields");
      return;
    }

    const updatedBookmark = { title, url };
    const res = await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBookmark),
    });

    if (res.status === 200) {
      setBookmarks((prev) =>
        prev.map((b) =>
          b._id === editingId ? { ...b, title, url } : b
        )
      );
      closeModal();
    } else {
      console.error("Failed to update bookmark", res);
      alert("Update failed. Check the console.");
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } else {
      console.error("Failed to delete bookmark", res);
      alert("Delete failed. Check the console.");
    }
  };

  // ---------------------- Modal Controls ----------------------
  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setModalOpen(true);
  };

  const openEditModal = (bm) => {
    setEditingId(bm._id);
    setTitle(bm.title);
    setUrl(bm.url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTitle("");
    setUrl("");
    setEditingId(null);
  };
  
  const isEditing = !!editingId;
  const onSubmit = isEditing ? handleUpdate : handleAdd;

  const contextValue = {
    // State
    bookmarks,
    modalOpen,
    title,
    url,
    editingId,
    
    // State Setters
    setTitle,
    setUrl,

    // Handlers
    handleDelete,
    openAddModal,
    openEditModal,
    closeModal,
    
    // Values for Modal
    isEditing,
    onSubmit
  };

  // 3. Return the Provider with the value
  return (
    <BookmarkContext.Provider value={contextValue}>
      {children}
    </BookmarkContext.Provider>
  );
};

// 4. Custom Hook to use the Context
export const useBookmarks = () => {
  return useContext(BookmarkContext);
};