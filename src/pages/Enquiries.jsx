import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/enquiries`);
      setEnquiries(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch enquiries");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await axios.delete(`${baseUrl}/api/enquiries/${id}`);
      setEnquiries((prev) => prev.filter((enquiry) => enquiry._id !== id));
    } catch (err) {
      alert("Failed to delete enquiry");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full">
     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold" style={{ fontFamily: "FrieghtNeo" }}>
          Enquiries
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading enquiries...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto" style={{ fontFamily: "Gothic" }}>
          <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Note</th>
                <th className="border border-gray-300 p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry, index) => (
                <tr key={enquiry._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center"> {new Date(enquiry.createdAt).toLocaleDateString()}</td>
                  <td className="border border-gray-300 p-2 text-center">{enquiry.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{enquiry.phone}</td>
                  <td className="border border-gray-300 p-2 text-center">{enquiry.email}</td>
                  <td className="border border-gray-300 p-2 text-center">{enquiry.note}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDelete(enquiry._id)}
                      className="text-red-600"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan="6" className="border border-gray-300 p-4 text-center text-gray-500">
                    No enquiries found.
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

export default EnquiriesPage;
