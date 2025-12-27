/* eslint-disable react/prop-types */
import { useContext } from "react";
import TaskContext from "../../context/TaskContext";
import axios from "axios";

const TaskCard = ({ task }) => {
  const { setTasks } = useContext(TaskContext);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3000/api/tasks/${taskId}/status`,
        { completed: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Task listesini güncelle
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? response.data : t))
      );
    } catch (err) {
      console.error("Status güncellenirken hata:", err);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-3 bg-white shadow-lg rounded-lg border border-gray-200">
      <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
      <p className="text-gray-600 text-sm">{task.description}</p>

      <select
        value={task.completed || "not started"}
        onChange={(e) => handleStatusChange(task._id, e.target.value)}
        className="border p-2 rounded-md text-sm"
      >
        <option value="not started">Not Started</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <div className="flex flex-col gap-1 text-xs text-gray-500">
        {task.project && <span>📁 Project: {task.project}</span>}
        {task.level && <span>⚡ Level: {task.level}</span>}
      </div>
    </div>
  );
};

export default TaskCard;
