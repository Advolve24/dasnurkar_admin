import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/");
    } else {
      fetchProjects();
    }
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/projects`);
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch projects");
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/projects/${id}`);
      setEditingProject(response.data);
      setShowFormModal(true);
    } catch (err) {
      alert("Failed to load project data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${baseUrl}/api/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    fetchProjects();
    handleFormClose();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full" style={{ fontFamily: 'Montserrat' }}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2
          className="text-xl sm:text-2xl font-semibold w-full text-center sm:text-left"
          
        >
          Projects
        </h2>

        <div className="flex justify-center w-full sm:w-auto">
          <button
            onClick={() => setShowFormModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-black min-w-fit whitespace-nowrap"
          >
            + Add Project
          </button>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full sm:w-4/5 md:w-3/5 lg:w-2/3 max-h-[90vh] overflow-y-auto relative">
           <div className="sticky top-0 bg-white z-20 flex justify-between items-center p-2 sm:p-4 ">
                 <h2 className="text-lg sm:text-xl font-semibold">
                   {editingProject ? "Edit Project" : "Add New Project"}
                 </h2>
                 <button
                   onClick={handleFormClose}
                   className="text-black/80 hover:text-black text-2xl"
                   aria-label="Close modal"
                 >
                   <IoCloseCircleOutline />
                 </button>
               </div>
           
            <ProjectForm
              existingData={editingProject}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading projects...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto"  style={{ fontFamily: 'Montserrat' }}>
          <table className="min-w-full border-collapse border border-[#ebebeb] text-sm md:text-base">
            <thead>
              <tr className="bg-[#f0f0f0]">
                <th className="border border-[#ebebeb] p-2">No</th>
                <th className="border border-[#ebebeb] p-2">Main Image</th>
                <th className="border border-[#ebebeb] p-2">Project Name</th>
                <th className="border border-[#ebebeb] p-2">Edit</th>
                <th className="border border-[#ebebeb] p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="border border-[#ebebeb] p-2 text-center">{index + 1}</td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    <img
                      src={project.mainImage}
                      alt={project.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="border border-[#ebebeb] p-2 text-center">{project.name}</td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    <button
                      onClick={() => handleEdit(project._id)}
                      className="text-blue-600 hover:underline"
                    >
                      <FiEdit />
                    </button>
                  </td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="5" className="border border-[#ebebeb] p-4 text-center text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
