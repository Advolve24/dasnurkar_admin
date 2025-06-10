import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectForm({ existingData = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    client: '',
    scale: '',
    location: '',
    size: '',
  });

  const [mainImage, setMainImage] = useState(null);
  const [previewMainImage, setPreviewMainImage] = useState(null);

  // Separate existing and new sub images
  const [existingSubImages, setExistingSubImages] = useState([]); // URLs
  const [newSubImages, setNewSubImages] = useState([]); // File objects

  // Create previews for newSubImages
  const newSubImagesPreviews = newSubImages.map((file) => URL.createObjectURL(file));

   const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/blogs';

  useEffect(() => {
    if (existingData) {
      setFormData({
        title: existingData.title || '',
        name: existingData.name || '',
        client: existingData.client || '',
        scale: existingData.scale || '',
        location: existingData.location || '',
        size: existingData.size || '',
      });
      setPreviewMainImage(existingData.mainImage || null);
      setExistingSubImages(existingData.subImages || []);
      setNewSubImages([]); // reset new sub images
      setMainImage(null);  // reset mainImage file input
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        title: value,
        scale: value === 'RESIDENTIAL' ? prev.scale : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    if (file) setPreviewMainImage(URL.createObjectURL(file));
  };

  // New sub images added by user
  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewSubImages((prev) => [...prev, ...files]);
  };

  const handleRemoveMainImage = () => {
    setMainImage(null);
    setPreviewMainImage(null);
  };

  // Remove an existing sub image URL
  const handleRemoveExistingSubImage = (urlToRemove) => {
    setExistingSubImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  // Remove a new sub image file by index
  const handleRemoveNewSubImage = (indexToRemove) => {
    setNewSubImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    const cleanedFormData = { ...formData };

    if (cleanedFormData.title !== 'RESIDENTIAL') {
      delete cleanedFormData.scale;
    }

    // Append form fields
    Object.entries(cleanedFormData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append main image if newly selected
    if (mainImage) data.append('mainImage', mainImage);

    // Append new sub images files
    newSubImages.forEach((file) => data.append('subImages', file));

    // Append existing sub images URLs as JSON string
    data.append('existingSubImages', JSON.stringify(existingSubImages));

    try {
      const response = existingData
        ? await axios.put(`${baseUrl}/api/projects/${existingData._id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await axios.post(`${baseUrl}/api/projects`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      console.log('✅ Project saved:', response.data);
      alert('Project saved successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Save failed:', error.response?.data || error.message);
      alert('Failed to save project.');
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-lg border font-sans"  style={{ fontFamily: 'Montserrat' }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select Project Title</option>
            <option value="RESIDENTIAL">RESIDENTIAL</option>
            <option value="COMMERCIAL">COMMERCIAL</option>
            <option value="INTERIORS">INTERIORS</option>
            <option value="LANDSCAPE">LANDSCAPE</option>
            <option value="EDUCATIONAL">EDUCATIONAL</option>
            <option value="OTHERS">OTHERS</option>
          </select>
        </div>

        {/* Scale */}
        {formData.title === 'RESIDENTIAL' && (
          <div>
            <label className="block font-medium mb-1">Scale</label>
            <select
              name="scale"
              value={formData.scale}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Scale</option>
              <option value="SMALL">SMALL</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LARGE">LARGE</option>
            </select>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Client */}
        <div>
          <label className="block font-medium mb-1">Client</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block font-medium mb-1">Size</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block font-medium mb-1">Main Image</label>
          <input
            type="file"
            name="mainImage"
            accept="image/*"
            onChange={handleMainImageChange}
            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
          />
          {previewMainImage && (
            <div className="mt-2 relative inline-block">
              <img
                src={previewMainImage}
                alt="Main Preview"
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={handleRemoveMainImage}
                className="absolute top-[-8px] right-[-8px] text-black rounded-full w-5 h-5 text-xs flex items-center justify-center"
                title="Remove"
              >
                ✖
              </button>
            </div>
          )}
        </div>

        {/* Sub Images */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-medium mb-1">Sub Images</label>
          <input
            type="file"
            name="subImages"
            accept="image/*"
            multiple
            onChange={handleSubImagesChange}
            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
          />

          {(existingSubImages.length > 0 || newSubImages.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {/* Existing sub images */}
              {existingSubImages.map((url, i) => (
                <div
                  key={'existing-' + i}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border border-gray-300 rounded overflow-hidden"
                >
                  <img src={url} alt={`existing-sub-${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingSubImage(url)}
                    className="absolute top-[-4px] right-[-4px] text-black rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    title="Remove"
                  >
                    ✖
                  </button>
                </div>
              ))}

              {/* New sub images */}
              {newSubImagesPreviews.map((src, i) => (
                <div
                  key={'new-' + i}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border border-gray-300 rounded overflow-hidden"
                >
                  <img src={src} alt={`new-sub-${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewSubImage(i)}
                    className="absolute top-[-4px] right-[-4px] text-black rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    title="Remove"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit & Cancel */}
        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="submit"
            className="flex-1 border border-grey-700  text-black text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] py-2 px-4 rounded-md transition"
          >
            {existingData ? 'Update Project' : 'Submit Project'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-grey-700  text-black text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] py-2 px-4 rounded-md transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
