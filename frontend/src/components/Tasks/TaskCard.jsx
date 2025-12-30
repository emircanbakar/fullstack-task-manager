/* eslint-disable react/prop-types */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isDragging) {
    return (
      <div className="flex flex-col p-3 gap-2 bg-white shadow-lg rounded border-2 border-gray-900">
        {task.level && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded border w-fit ${getLevelColor(
              task.level
            )}`}
          >
            {task.level.toUpperCase()}
          </span>
        )}
        <h3 className="font-semibold text-sm text-gray-900">{task.title}</h3>
        <p className="text-gray-600 text-xs line-clamp-2">{task.description}</p>
        <div className="flex flex-row gap-3 text-xs text-gray-500">
          {task.project && <span>📁 {task.project}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col p-3 gap-2 bg-white rounded border border-gray-300 hover:border-gray-400 cursor-grab active:cursor-grabbing transition-all"
    >
      {task.level && (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded border w-fit ${getLevelColor(
            task.level
          )}`}
        >
          {task.level.toUpperCase()}
        </span>
      )}
      <h3 className="font-semibold text-sm text-gray-900">{task.title}</h3>
      <p className="text-gray-600 text-xs line-clamp-2">{task.description}</p>

      <div className="flex flex-row gap-3 text-xs text-gray-500">
        {task.project && <span>📁 {task.project}</span>}
      </div>
    </div>
  );
};

export default TaskCard;
