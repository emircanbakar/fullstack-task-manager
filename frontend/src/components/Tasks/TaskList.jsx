/* eslint-disable react/prop-types */
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import { useContext, useEffect } from "react";
import TaskContext from "../../context/TaskContext";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

// Droppable zone component
const DroppableZone = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
};

const TaskList = () => {
  const { tasks, loading, error, setTasks, setLoading, setError } =
    useContext(TaskContext);
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(response.data);
        setLoading(false);
        console.log(response, "tasks");
      } catch (err) {
        setError("Görevler yüklenirken bir hata oluştu.");
        console.log(err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const notStartedTasks = tasks.filter(
    (task) => task.completed === "not started"
  );
  const inProgressTasks = tasks.filter(
    (task) => task.completed === "in progress"
  );
  const completedTasks = tasks.filter((task) => task.completed === "completed");

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Eğer task üzerine bırakıldıysa, o task'ın bulunduğu kolonu bul
    let finalStatus = newStatus;
    if (!["not started", "in progress", "completed"].includes(newStatus)) {
      // Bir task üzerine bırakıldıysa, o task'ın statusunu al
      const targetTask = tasks.find((t) => t._id === newStatus);
      if (targetTask) {
        finalStatus = targetTask.completed;
      } else {
        return; // Geçersiz hedef
      }
    }

    // Eğer aynı status'a bırakıldıysa hiçbir şey yapma
    const task = tasks.find((t) => t._id === taskId);
    if (task.completed === finalStatus) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3000/api/tasks/${taskId}/status`,
        { completed: finalStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Task listesini güncelle
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? response.data : t))
      );
    } catch (err) {
      console.error("Status güncellenirken hata:", err);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (loading) {
    return <div>Görevler yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="flex flex-col h-screen overflow-hidden px-4 py-6 bg-white">
      <Toaster />
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex flex-row justify-between mb-6 flex-shrink-0">
        <h1 className="text-stone-800 text-3xl font-bold">Görev Listesi</h1>
        <div className="flex flex-row">
          <button
            className="text-white px-4 py-2 bg-black rounded-md hover:bg-gray-800 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            New Task
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Not Started Column */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-2 mb-3 border-b-2 border-gray-300 flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Not Started
              </h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {notStartedTasks.length}
              </span>
            </div>
            <DroppableZone id="not started">
              <SortableContext
                items={notStartedTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="flex flex-col gap-3 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500"
                  style={{ maxHeight: "calc(100vh - 250px)" }}
                >
                  {notStartedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </DroppableZone>
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-2 mb-3 border-b-2 border-gray-400 flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                In Progress
              </h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {inProgressTasks.length}
              </span>
            </div>
            <DroppableZone id="in progress">
              <SortableContext
                items={inProgressTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="flex flex-col gap-3 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500"
                  style={{ maxHeight: "calc(100vh - 250px)" }}
                >
                  {inProgressTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </DroppableZone>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-2 mb-3 border-b-2 border-gray-900 flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Completed
              </h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {completedTasks.length}
              </span>
            </div>
            <DroppableZone id="completed">
              <SortableContext
                items={completedTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="flex flex-col gap-3 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500"
                  style={{ maxHeight: "calc(100vh - 250px)" }}
                >
                  {completedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </DroppableZone>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard task={tasks.find((t) => t._id === activeId)} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TaskList;
