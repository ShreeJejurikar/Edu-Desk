/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import Navbar from "./components/Navbar";
import HeroSection from "./components/Hero";
import Features from "./components/Feature";
import NotesPreview from "./components/Notesp";
import About from "./components/About";
import UploadForm from "./components/UploadF";
import AuthForm from "./components/AuthForm";
import Footer from "./components/Footer";
import { ToastContainer } from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import { doSignOut } from "./firebase/auth";

const API_BASE = "https://edudesk.onrender.com"

function App() {
  // UI State
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [showLogin, setShowLogin] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");

  // Toast State
  const [toasts, setToasts] = useState([]);

  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data State
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // Confirm Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Use ref to prevent infinite loops
  const fetchNotesRef = useRef();

  // Toast functions
  const showToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Theme toggle function
  const onToggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Firebase authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      // Sync localStorage with Firebase auth state
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        localStorage.setItem("eduUser", JSON.stringify(userData));
      } else {
        localStorage.removeItem("eduUser");
      }
    });

    return () => unsubscribe();
  }, []);

  fetchNotesRef.current = async () => {
    setNotesLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (user) {
        try {
          const idToken = await user.getIdToken();
          headers["Authorization"] = `Bearer ${idToken}`;
        } catch (tokenError) {
          console.warn("Failed to get auth token:", tokenError);
        }
      }

      const response = await fetch(`${API_BASE}/api/files/notes`, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        const notesArray = data.files || data.notes || [];
        setNotes(notesArray);
      } else {
        setNotes([]);
        console.error("Failed to fetch notes:", await response.json());
      }
    } catch (error) {
      setNotes([]);
      console.error("Error fetching notes:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  // Fetch notes on auth resolved or user change
  useEffect(() => {
    if (!authLoading) fetchNotesRef.current();
  }, [authLoading, user]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const addNote = async (note) => {
    setNotes((prev) => [note, ...prev]);
    await fetchNotesRef.current();
  };

  // Delete note function
  const deleteNote = async (id) => {
    try {
      if (!user) {
        showToast("Please sign in to delete notes.", "warning");
        return;
      }

      const idToken = await user.getIdToken(true);

      const response = await fetch(`${API_BASE}/api/files/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        await fetchNotesRef.current();
        showToast("Note deleted successfully! 🗑️", "success");
      } else {
        handleDeleteError(result);
      }
    } catch (error) {
      showToast("Network error: " + error.message, "error");
    }
  };

  // Request delete via modal
  const requestDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  // Handle delete errors
  const handleDeleteError = (result) => {
    switch (result.code) {
      case "UNAUTHORIZED_DELETE":
        showToast("You can only delete your own notes.", "error");
        break;
      case "INVALID_TOKEN":
      case "NO_TOKEN":
        showToast("Please sign in again to delete notes.", "warning");
        break;
      case "FILE_NOT_FOUND":
        showToast("Note not found or already deleted.", "warning");
        break;
      default:
        showToast(result.error || "Failed to delete note", "error");
    }
  };

  // Download note function
  const downloadNote = async (id, filename) => {
    try {
      const response = await fetch(`${API_BASE}/api/files/download/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename || `note_${id}`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast("Download started! 📥", "success", 2000);
      } else {
        const result = await response.json();
        showToast(result.error || "Failed to download file", "error");
      }
    } catch (error) {
      showToast("Network error: " + error.message, "error");
    }
  };

  // Auth handlers
  const handleLogin = () => {
    setShowLogin(false);
    showToast("Welcome back! 👋", "success");
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      setUser(null);
      localStorage.removeItem("eduUser");
      showToast("Logged out successfully! See you soon! 👋", "info");
    } catch (error) {
      setUser(null);
      localStorage.removeItem("eduUser");
      showToast("Logged out successfully!", "info");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Checking authentication...
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Navbar */}
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        user={user}
        onLogoutClick={handleLogout}
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
      />

      {/* Auth Modal */}
      {showLogin && (
        <AuthForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}

      {/* Main Content */}
      <div id="home">
        <HeroSection onLoginClick={() => setShowLogin(true)} user={user} />
      </div>

      <div id="features">
        <Features />
      </div>

      <div id="notes">
        <NotesPreview
          notes={notes}
          deleteNote={requestDelete}
          downloadNote={downloadNote}
          selectedDept={selectedDept}
          user={user}
          loading={notesLoading}
        />
      </div>

      <div id="upload">
        <UploadForm
          notes={notes}
          addNote={addNote}
          user={user}
          onLoginClick={() => setShowLogin(true)}
          showToast={showToast}
        />
      </div>

      <div id="about">
        <About />
      </div>

      <div id="contact">
        <Footer />
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={async () => {
          if (pendingDeleteId) {
            await deleteNote(pendingDeleteId); // wait for deletion to finish
          }
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </>
  );
}

export default App;
