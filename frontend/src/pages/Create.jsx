import { useContext, useState } from "react";
import TaskContext from "../context/TaskContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const navigate = useNavigate();
  const { setTasks } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [level, setLevel] = useState("low");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await axios.post(
        "http://localhost:3000/api/tasks",
        { title, description, level, project },
        config
      );
      setTasks((prevTasks) => [...prevTasks, res.data]);

      console.log("Görev başarıyla oluşturuldu:", res.data);
      setTitle("");
      setDescription("");
      setProject("");
      setLevel("low");
    } catch (error) {
      console.error("Görev oluşturulurken bir hata oluştu:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Yeni Görev Ekle</h2>
      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Task Name"
          className="border p-2 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          className="border p-2 rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Project"
          className="border p-2 rounded-md"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          onClick={() => navigate("/home")}
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
