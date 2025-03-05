import { useContext, useState } from "react";
import TaskContext from "../context/TaskContext";
import axios from "axios";

const CreateTask = () => {
  const { setTasks } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
        { title, description },
        config
      );
      setTasks((prevTasks) => [...prevTasks, res.data]);

      console.log("Görev başarıyla oluşturuldu:", res.data);
      setTitle("");
      setDescription("");
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
          placeholder="Görev Başlığı"
          className="border p-2 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Görev Açıklaması"
          className="border p-2 rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Görev Ekle
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
