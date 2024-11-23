import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortByDate, setSortByDate] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title || !description || !dueDate) return alert("All fields are required!");
    const newTask = { title, description, dueDate, status };
    setTasks([...tasks, newTask]);
    resetForm();
  };

  const editTask = (index) => {
    const task = tasks[index];
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setEditingIndex(index);
    setCurrentPage("add");
  };

  const updateTask = () => {
    const updatedTasks = tasks.map((task, index) =>
      index === editingIndex ? { title, description, dueDate, status } : task
    );
    setTasks(updatedTasks);
    resetForm();
  };

  const deleteTask = (index) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("Pending");
    setEditingIndex(null);
    setCurrentPage("home");
  };

  const applyFilters = () => {
    let filteredTasks = tasks;

    if (filterStatus !== "All") {
      filteredTasks = filteredTasks.filter((task) => task.status === filterStatus);
    }

    if (sortByDate) {
      filteredTasks = filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return filteredTasks;
  };

  const renderHomePage = () => (
    <div className="container">
      <h1 className="title">Task Manager</h1>
      <button className="button" onClick={() => setCurrentPage("add")}>
        Add New Task
      </button>
      <button className="button" onClick={() => setCurrentPage("tasks")}>
        View Tasks
      </button>
    </div>
  );

  const renderTaskForm = () => (
    <div className="container">
      <h2>{editingIndex !== null ? "Edit Task" : "Add Task"}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button className="button" onClick={editingIndex !== null ? updateTask : addTask}>
        {editingIndex !== null ? "Update Task" : "Add Task"}
      </button>
      <button className="button" onClick={() => setCurrentPage("home")}>
        Cancel
      </button>
    </div>
  );

  const renderTaskList = () => {
    const filteredTasks = applyFilters();

    return (
      <div className="container">
        <h2>Task List</h2>

        {/* Filters */}
        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            className={`button small ${sortByDate ? "active" : ""}`}
            onClick={() => setSortByDate(!sortByDate)}>
            {sortByDate ? "Unsort by Date" : "Sort by Due Date"}
          </button>
       </div>

        {/* Task Table */}
        {filteredTasks.length === 0 ? (
          <p>No tasks available. Add a new task!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.dueDate}</td>
                  <td>{task.status}</td>
                  <td>
                    <button className="button small" onClick={() => editTask(index)}>
                      Edit
                    </button>
                    <button className="button small delete" onClick={() => deleteTask(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="button" onClick={() => setCurrentPage("home")}>
          Back to Home
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      {currentPage === "home" && renderHomePage()}
      {currentPage === "add" && renderTaskForm()}
      {currentPage === "tasks" && renderTaskList()}
    </div>
  );
}

export default App;