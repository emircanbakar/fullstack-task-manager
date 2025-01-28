import LeftHeader from "../components/LeftHeader";
import TaskList from "../components/Tasks/TaskList";

const Home = () => {
  return (
    <div className="flex flex-row h-screen w-auto">
      <LeftHeader />
      <TaskList />
    </div>
  );
};

export default Home;
