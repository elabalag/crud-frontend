// App.jsx
import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://crud-backend-1-ryr8.onrender.com/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch {
      alert("Failed to load tasks");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      if (editId) {
        setTasks(tasks.map((t) => (t._id === editId ? result : t)));
      } else {
        setTasks([...tasks, result]);
      }

      setTitle("");
      setEditId(null);
    } catch (err) {
      alert(err.message || "Action failed");
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch {
      alert("Toggle failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setEditId(task._id);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", textAlign: "center" }}>
      <h1>Task Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          style={{ padding: "0.5rem", width: "70%" }}
        />
        <button style={{ padding: "0.5rem", marginLeft: 8 }}>
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setEditId(null);
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem 0",
              borderBottom: "1px solid #ccc",
              alignItems: "center",
            }}
          >
            <span
              onClick={() => toggleComplete(task._id)}
              style={{
                cursor: "pointer",
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "gray" : "black",
              }}
            >
              {task.completed ? "✔️" : "⭕"} {task.title}
            </span>
            <div>
              <button onClick={() => startEdit(task)} style={{ marginRight: 8 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
