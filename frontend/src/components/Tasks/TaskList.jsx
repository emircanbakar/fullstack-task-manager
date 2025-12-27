import TaskCard from "./TaskCard";
import { Link } from "react-router";
import { useContext, useEffect } from "react";
import TaskContext from "../../context/TaskContext";
import axios from "axios";

const TaskList = () => {
  const { tasks, loading, error, setTasks, setLoading, setError } =
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

  const notStartedTasks = tasks.filter(
    (task) => task.completed === "not started"
  );
  const inProgressTasks = tasks.filter(
    (task) => task.completed === "in progress"
  );
  const completedTasks = tasks.filter((task) => task.completed === "completed");

  if (loading) {
    return <div>Görevler yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-8 bg-slate-100 rounded-md mx-2">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-stone-800 text-3xl font-bold">Görev Listesi</h1>
        <div className="flex flex-row">
          <Link
            className="text-white px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
            to="/newTask"
          >
            New Task
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Not Started Column */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-700 bg-yellow-100 p-2 rounded-md">
            Not Started ({notStartedTasks.length})
          </h2>
          <div className="flex flex-col gap-2">
            {notStartedTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-700 bg-blue-100 p-2 rounded-md">
            In Progress ({inProgressTasks.length})
          </h2>
          <div className="flex flex-col gap-2">
            {inProgressTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-700 bg-green-100 p-2 rounded-md">
            Completed ({completedTasks.length})
          </h2>
          <div className="flex flex-col gap-2">
            {completedTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
