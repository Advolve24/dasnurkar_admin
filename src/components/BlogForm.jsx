import React, { useEffect, useRef, useState } from 'react';

function BlogForm({ blogData = null, onSuccess = () => {}, onClose = () => {} }) {
  const editorId = "tinymce-editor";
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);

  useEffect(() => {
    if (blogData) {
      setTitle(blogData.title || '');
      setDate(blogData.date ? blogData.date.slice(0, 10) : '');
      setContent(blogData.content || '');
    }
  }, [blogData]);

  useEffect(() => {
    if (window.tinymce) {
      window.tinymce.init({
        selector: `#${editorId}`,
        plugins: 'lists link image code',
        toolbar:
          'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code',
        height: 300,
        setup: (editor) => {
          editor.on('Change KeyUp', () => {
            setContent(editor.getContent());
          });
          editor.on('init', () => {
            if (blogData?.content) {
              editor.setContent(blogData.content);
            }
          });
        },
      });
    }

    return () => {
      if (window.tinymce) {
        window.tinymce.remove(`#${editorId}`);
      }
    };
  }, [blogData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('date', date);
    data.append('content', content);
    if (mainImage) data.append('mainImage', mainImage);
    subImages.forEach(file => data.append('subImages', file));

    try {
      const response = await fetch(
        blogData
          ? `http://localhost:3000/api/blogs/${blogData._id}`
          : 'http://localhost:3000/api/blogs',
        {
          method: blogData ? 'PUT' : 'POST',
          body: data,
        }
      );

      if (response.ok) {
        alert(blogData ? 'Blog updated successfully!' : 'Blog uploaded successfully!');
        onSuccess();
        onClose();
      } else {
        alert('Failed to save blog.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg border max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setMainImage(e.target.files[0])}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <div className="mt-3 relative inline-block">
            {mainImage ? (
              <>
                <img
                  src={URL.createObjectURL(mainImage)}
                  alt="Selected Main"
                  className="w-40 h-40 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => setMainImage(null)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80"
                  aria-label="Remove main image"
                >
                  &times;
                </button>
              </>
            ) : blogData?.mainImage ? (
              <img
                src={blogData.mainImage}
                alt="Current Main"
                className="w-40 h-40 object-cover rounded border"
              />
            ) : null}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Content (Rich Text)</label>
          <textarea
            id={editorId}
            defaultValue={content}
            className="w-full border border-gray-300 rounded-md p-3"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Sub Images (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => setSubImages(Array.from(e.target.files))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {subImages.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {subImages.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`sub-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSubImages(subImages.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-opacity-80"
                    aria-label={`Remove sub image ${idx + 1}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-900 text-white py-2 rounded-md text-lg"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
}

export default BlogForm;
