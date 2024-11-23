import React, { useState } from "react";

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [editableTaskId, setEditableTaskId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (task) => {
    setEditableTaskId(task.id);
    setEditData({ ...task });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateTask(editData);
    setEditableTaskId(null);
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          {editableTaskId === task.id ? (
            <form onSubmit={handleEditSubmit}>
              <input
                name="title"
                value={editData.title}
                onChange={handleEditChange}
              />
              <textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
              />
              <input
                name="dueDate"
                type="date"
                value={editData.dueDate}
                onChange={handleEditChange}
              />
              <select
                name="status"
                value={editData.status}
                onChange={handleEditChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button type="submit">Save</button>
            </form>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Due: {task.dueDate}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => handleEditClick(task)}>Edit</button>
              <button onClick={() => onDeleteTask(task.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;