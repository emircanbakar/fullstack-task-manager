import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-between text-md text-black items-center px-4 gap-16 w-full h-16">
      <div className="flex flex-row justify-between items-center gap-40">
        <div
          className="bg-black text-white shadow-md px-8 py-2 rounded-full "
          onClick={() => navigate("/home")}
        >
          home
        </div>
        <div className="flex flex-row gap-8 bg-black text-white shadow-md px-8 py-2 rounded-full ">
          <span onClick={() => navigate("/overview")}>overview</span>
          <span onClick={() => navigate("/manage")}>manage</span>
          <span onClick={() => navigate("/calendar")}>calendar</span>
          <span onClick={() => navigate("/projects")}>projects</span>
          <span onClick={() => navigate("/activity")}>activity</span>
          <span onClick={() => navigate("/backlog")}>backlog</span>
        </div>
      </div>
      <div className="bg-black text-white shadow-md px-4 py-2 rounded-full ">
        u
      </div>
    </div>
  );
};

export default Header;
