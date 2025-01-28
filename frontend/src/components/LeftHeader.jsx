const LeftHeader = () => {
  return (
    <div className="flex flex-col text-left text-xl bg-slate-100 text-black py-8 px-4 gap-16 justify-start w-auto h-full">
      <ul className="flex flex-col gap-2">
        <li>Backlog</li>
        <li>Board</li>
        <li>My Tasks</li>
      </ul>
      <ul  className="flex flex-col gap-2">
        <li>Issues</li>
        <li>Releases</li>
      </ul>
      <ul  className="flex flex-col gap-2">
        <li>Documentation</li>
        <li>APIs</li>
      </ul>
    </div>
  );
};

export default LeftHeader;
