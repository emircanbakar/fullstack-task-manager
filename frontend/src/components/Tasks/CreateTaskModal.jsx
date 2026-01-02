/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import TaskContext from "../../context/TaskContext";
import axios from "axios";
import toast from "react-hot-toast";

const CreateTaskModal = ({ isOpen, onClose }) => {
  const { setTasks } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [level, setLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!title.trim()) {
      toast.error("Task title is required!", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (title.trim().length < 3) {
      toast.error("Task title must be at least 3 characters!", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Task description is required!", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (description.trim().length < 10) {
      toast.error("Task description must be at least 10 characters!", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (!level) {
      toast.error("Please select a priority level!", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await axios.post(
        "http://localhost:3000/api/tasks",
        {
          title: title.trim(),
          description: description.trim(),
          level,
          project: project.trim(),
        },
        config
      );

      setTasks((prevTasks) => [...prevTasks, res.data]);

      toast.success("Task created successfully! 🎉", {
        duration: 3000,
        position: "top-right",
      });

      // Clear form
      setTitle("");
      setDescription("");
      setProject("");
      setLevel("");

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the task!",
        {
          duration: 4000,
          position: "top-right",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-mono">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Task Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter task title"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Task Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Task Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                placeholder="Enter task description"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
              ></textarea>
            </div>

            {/* Project Name and Priority in one row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Project Name */}
              <div>
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-900 mb-1.5"
                >
                  Project{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  id="project"
                  type="text"
                  placeholder="Project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  maxLength={50}
                />
              </div>

              {/* Priority Level */}
              <div>
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-900 mb-1.5"
                >
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors bg-white"
                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
