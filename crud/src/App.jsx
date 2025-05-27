import React, { useEffect, useState } from "react";
import './App.css'
const API_URL = "https://crud-backend-6msv.onrender.com/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTitle("");
    } else {
      alert("Failed to add task");
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(tasks.map((task) => (task._id === editId ? updatedTask : task)));
      setEditId(null);
      setTitle("");
    } else {
      alert("Failed to update task");
    }
  };

  const toggleComplete = async (id) => {
    const res = await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } else {
      alert("Failed to toggle task");
    }
  };

  const handleDeleteTask = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks(tasks.filter((task) => task._id !== id));
    } else {
      alert("Failed to delete task");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", textAlign: "center" }}>
      <h1>Daily Task Manager</h1>

      <form onSubmit={editId ? handleUpdateTask : handleAddTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          style={{ width: "70%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: "0.5rem 1rem" }}>
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setTitle("");
            }}
            style={{ marginLeft: 8, padding: "0.5rem 1rem" }}
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
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: "1px solid #ccc",
            }}
          >
            <span
              onClick={() => toggleComplete(task._id)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "gray" : "black",
              }}
              title="Click to toggle completion"
            >
              {task.completed ? "✔️ " : "⭕ "} {task.title}
            </span>
            <div>
              <button onClick={() => startEdit(task)} style={{ marginRight: 8 }}>
                Edit
              </button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
