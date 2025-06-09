import React, { useEffect, useState } from 'react';

function ClientForm({ clientData = null, onSuccess = () => {}, onClose = () => {} }) {
  const [clientName, setClientName] = useState('');
  const [logo, setLogo] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (clientData) {
      setClientName(clientData.clientName || '');
      setDescription(clientData.description || '');
    }
  }, [clientData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('clientName', clientName);
    data.append('description', description);
    if (logo) data.append('logo', logo);

    try {
      const response = await fetch(
        clientData
          ? `http://localhost:3000/api/clients/${clientData._id}`
          : 'http://localhost:3000/api/clients',
        {
          method: clientData ? 'PUT' : 'POST',
          body: data,
        }
      );

      if (response.ok) {
        alert(clientData ? 'Client updated successfully!' : 'Client added successfully!');
        onSuccess();
        onClose();
      } else {
        alert('Failed to save client.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Logo Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <div className="mt-3 relative inline-block">
          {logo ? (
            <>
              <img
                src={URL.createObjectURL(logo)}
                alt="Selected Logo"
                className="w-32 h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => setLogo(null)}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80"
              >
                &times;
              </button>
            </>
          ) : clientData?.logo ? (
            <img
              src={clientData.logo}
              alt="Current Logo"
              className="w-32 h-32 object-cover rounded border"
            />
          ) : null}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black hover:bg-black text-white py-2 rounded-md text-lg"
      >
        {clientData ? 'Update Client' : 'Add Client'}
      </button>
    </form>
  );
}

export default ClientForm;
