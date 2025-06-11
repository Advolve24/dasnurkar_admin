import { useEffect, useState } from "react";
import ClientForm from "../components/ClientForm";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
   const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/clients';

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/clients`);
      setClients(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch clients");
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/clients/${id}`);
      setEditingClient(response.data);
      setShowFormModal(true);
    } catch (err) {
      alert("Failed to load client data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await axios.delete(`${baseUrl}/api/clients/${id}`);
      setClients((prev) => prev.filter((client) => client._id !== id));
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingClient(null);
  };

  const handleFormSuccess = () => {
    fetchClients();
    handleFormClose();
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 w-full pt-4"  style={{ fontFamily: 'Montserrat' }}>
      <div
        className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0"
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold"  style={{ fontFamily: 'Montserrat' }}>
          Clients
        </h2>

        <div className="w-1/2 sm:w-auto flex justify-center sm:justify-start">
          <button
            onClick={() => setShowFormModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-black w-full"
          >
            + Add Client
          </button>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-[60%] max-w-xl max-h-screen overflow-y-auto relative">
            <div className="sticky top-0 bg-white z-20 flex justify-between items-center p-2 sm:p-2 border-b mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold">
                              {editingClient ? "Edit Client" : "Add Client"}
                            </h2>
                            <button
                              onClick={handleFormClose}
                              className="text-black/80 hover:text-black text-2xl"
                              aria-label="Close modal"
                            >
                              <IoCloseCircleOutline />
                            </button>
                          </div>
            <ClientForm
              clientData={editingClient}
              onSuccess={handleFormSuccess}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading clients...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto"  style={{ fontFamily: 'Montserrat' }}>
          <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-[#f0f0f0]">
                <th className="border border-[#ebebeb] p-2">No</th>
                <th className="border border-[#ebebeb] p-2">Logo</th>
                <th className="border border-[#ebebeb] p-2">Client Name</th>
                <th className="border border-[#ebebeb] p-2">Edit</th>
                <th className="border border-[#ebebeb] p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client._id} className="hover:bg-[#ebebeb]">
                  <td className="border border-[#ebebeb] p-2 text-center">{index + 1}</td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    <img
                      src={client.logo}
                      alt={client.clientName}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded mx-auto"
                    />
                  </td>
                  <td className="border border-[#ebebeb] p-2 text-center">{client.clientName}</td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    <button
                      onClick={() => handleEdit(client._id)}
                      className="text-blue-600 hover:underline text-xl"
                    >
                      <FiEdit />
                    </button>
                  </td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-600 text-xl"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="5" className="border border-[#ebebeb] p-4 text-center text-gray-500">
                    No clients found.
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

export default ClientsPage;
