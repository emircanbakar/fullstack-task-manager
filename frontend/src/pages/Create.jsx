import { useContext, useEffect } from "react";
import TaskContext from "../context/TaskContext";
import axios from "axios";


const Create = () => {
  const  {setTasks} = useContext(TaskContext)

  useEffect(() => {
    const createTask = async (task) => {
      try {
        const res = await axios.post("/api/tasks", task);
        setTasks((prevTasks) => [...prevTasks, res.data]);
        console.log("Görev başarıyla oluşturuldu:", res.data);
      } catch (error) {
        console.error("Görev oluşturulurken bir hata oluştu:", error);
      }
    };
    createTask()
  });

  return <div></div>;
};

export default Create;
