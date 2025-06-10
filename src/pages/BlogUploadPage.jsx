import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import BlogForm from "../components/BlogForm";

const BlogListPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
  fetchBlogs();
}, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/blogs`);
      setBlogs(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch blogs");
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${baseUrl}/api/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingBlog(null);
  };

  const handleFormSuccess = () => {
    fetchBlogs();
    handleFormClose();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full"  style={{ fontFamily: 'Montserrat' }}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2
          className="text-xl sm:text-2xl font-semibold w-full text-center sm:text-left"
          style={{ fontFamily: "FrieghtNeo" }}
        >
          Blogs
        </h2>

        <div className="flex justify-center w-full sm:w-auto">
          <button
            onClick={() => setShowFormModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-black min-w-fit whitespace-nowrap"
          >
            + Add Blog
          </button>
        </div>
      </div>

      {showFormModal && (
       <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 sm:px-6">
  <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/5 lg:w-2/3 max-h-[90vh] flex flex-col">
    
    {/* Sticky Header with Close Button */}
    <div className="sticky top-0 bg-white z-20 flex justify-between items-center p-2 sm:p-4 border-b">
      <h2 className="text-lg sm:text-xl font-semibold">
        {editingBlog ? "Edit Blog" : "Add New Blog"}
      </h2>
      <button
        onClick={handleFormClose}
        className="text-black/80 hover:text-black text-2xl"
        aria-label="Close modal"
      >
        <IoCloseCircleOutline />
      </button>
    </div>

    {/* Scrollable Form Section */}
    <div className="overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
      <BlogForm
        blogData={editingBlog}
        onSuccess={handleFormSuccess}
        onClose={handleFormClose}
      />
    </div>
  </div>
</div>

      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto"  style={{ fontFamily: 'Montserrat' }}>
          <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">No</th>
                <th className="border border-gray-300 p-2">Main Image</th>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Edit</th>
                <th className="border border-gray-300 p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <img
                      src={blog.mainImage}
                      alt={blog.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {blog.title}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {new Date(blog.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:underline"
                    >
                      <FiEdit />
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="border border-gray-300 p-4 text-center text-gray-500"
                  >
                    No blogs found.
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

export default BlogListPage;
