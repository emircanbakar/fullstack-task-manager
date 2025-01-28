/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <TaskContext.Provider value={{ tasks, loading, error, setError, setTasks, setLoading }}>{children}</TaskContext.Provider>
  );
};

export default TaskContext;
