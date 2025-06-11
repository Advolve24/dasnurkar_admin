import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
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

  const handleExport = () => {
    const exportData = enquiries.map((enquiry, index) => ({
      No: index + 1,
      Name: enquiry.name,
      Phone: enquiry.phone,
      Email: enquiry.email || "",
      Note: enquiry.note || "",
      Date: new Date(enquiry.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "enquiries.xlsx");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full" style={{ fontFamily: "Montserrat" }}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 text-center sm:text-left gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Enquiries</h2>

        <button
          onClick={handleExport}
          className="bg-black text-white px-4 py-2 rounded hover:bg-black text-sm sm:text-base"
        >
          Export to Excel
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading enquiries...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-[#f0f0f0]">
                <th className="border border-[#ebebeb] p-2">No</th>
                <th className="border border-[#ebebeb] p-2">Date</th>
                <th className="border border-[#ebebeb] p-2">Name</th>
                <th className="border border-[#ebebeb] p-2">Phone</th>
                <th className="border border-[#ebebeb] p-2">Note</th>
                <th className="border border-[#ebebeb] p-2">View</th>
                <th className="border border-[#ebebeb] p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry, index) => (
                <tr key={enquiry._id} className="hover:bg-gray-50">
                  <td className="border border-[#ebebeb] p-2 text-center">{index + 1}</td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-[#ebebeb] p-2 text-center">{enquiry.name}</td>
                  <td className="border border-[#ebebeb] p-2 text-center">{enquiry.phone}</td>
                  <td
                    className="border border-[#ebebeb] p-2 text-center max-w-[150px] truncate"
                    title={enquiry.note}
                  >
                    {enquiry.note}
                  </td>
                  <td className="border border-[#ebebeb] p-2 text-center">
                    <button
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="text-blue-600 hover:underline"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="border border-[#ebebeb] p-2 text-center">
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
                  <td colSpan="7" className="border border-[#ebebeb] p-4 text-center text-gray-500">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Viewing Enquiry Details */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/5 lg:w-1/2 max-h-[90vh] overflow-y-auto relative p-4 sm:p-6">
            <div className="sticky top-0 z-10 bg-white flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-600 hover:text-black text-2xl"
                aria-label="Close modal"
              >
                <IoCloseCircleOutline />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <div>
                <label className="font-semibold block">Name</label>
                <p className="border border-[#ebebeb] rounded p-2">{selectedEnquiry.name}</p>
              </div>
              <div>
                <label className="font-semibold block">Phone</label>
                <p className="border border-[#ebebeb] rounded p-2">{selectedEnquiry.phone}</p>
              </div>
              <div>
                <label className="font-semibold block">Email</label>
                <p className="border border-[#ebebeb] rounded p-2">{selectedEnquiry.email}</p>
              </div>
              <div>
                <label className="font-semibold block">Date</label>
                <p className="border border-[#ebebeb] rounded p-2">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold block">Note</label>
                <p className="border border-[#ebebeb] rounded p-2 whitespace-pre-line">
                  {selectedEnquiry.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesPage;
