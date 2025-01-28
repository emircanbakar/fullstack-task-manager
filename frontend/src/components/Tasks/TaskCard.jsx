import { useEffect, useContext } from "react";
import TaskContext from "../../context/TaskContext";
import axios from "axios";

const TaskCard = () => {
  const { setLoading, setTasks, setError, tasks, loading, error } = useContext(TaskContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tasks"); // Backend API endpoint
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Görevler yüklenirken bir hata oluştu.");
        console.log(err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

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
        <ul className="grid gap-4 grid-cols-3 grid-rows-4">
          {tasks.map((task) => (
            <li
              className="flex flex-col bg-slate-300 p-2 rounded-md h-auto"
              key={task._id}
            >
              <span className="text-slate-800/60 py-1 px-2">
                {task.completed ? "Tamamlandı" : "Tamamlanmadı"}
              </span>
              <div className="flex flex-col bg-slate-700 p-4 rounded-md text-white">
                <h3 className="text-2xl">{task.title}</h3>
                <p className="">{task.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskCard;
