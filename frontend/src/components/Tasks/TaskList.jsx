import TaskCard from "./TaskCard";
import {Link} from "react-router"

const TaskList = () => {
  return (
    <div className="flex flex-col gap-2 p-8 bg-slate-100 rounded-md mx-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-stone-800 text-3xl font-bold">Görev Listesi</h1>
        
        <div className="flex flex-row">
          <Link className="text-black" to="/newTask" >New Task</Link>
          <Link className="text-black" to="/newTask" >New Task</Link>
        </div>
      </div>
      <TaskCard />
    </div>
  );
};

export default TaskList;
