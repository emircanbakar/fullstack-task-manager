import { useEffect, useContext } from "react";
import TaskContext from "../../context/TaskContext";
import axios from "axios";

const TaskCard = () => {
  const { setLoading, setTasks, setError, tasks, loading, error } =
    useContext(TaskContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(response.data);
        setLoading(false);
        console.log(response, "tasks");
      } catch (err) {
        setError("Görevler yüklenirken bir hata oluştu.");
        console.log(err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

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
        prevTasks.map((task) => (task._id === taskId ? response.data : task))
      );
    } catch (err) {
      console.error("Status güncellenirken hata:", err);
    }
  };

  if (loading) {
    return <div>Görevler yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      {tasks.length === 0 ? (
        <p>Gösterilecek görev yok.</p>
      ) : (
        <div className="grid gap-4 grid-cols-3 grid-rows-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col p-2 gap-4 bg-white shadow-lg rounded-lg"
            >
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>

              <select
                value={task.completed || "not started"}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="border p-2 rounded-md"
              >
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {task.project && (
                <span className="text-sm text-gray-500">
                  Project: {task.project}
                </span>
              )}
              {task.level && (
                <span className="text-sm text-gray-500">
                  Level: {task.level}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
