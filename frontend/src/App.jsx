import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateTask from "./pages/Create";
import { TaskProvider } from "./context/TaskContext";
import Auth from "./pages/Auth";

function App() {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/newTask" element={<CreateTask />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
