import Header from "../components/Header";
import TaskList from "../components/Tasks/TaskList";

const Home = () => {
  return (
    <div className="flex flex-col h-screen w-auto font-mono">
      <Header />
      <TaskList />
    </div>
  );
};

export default Home;
