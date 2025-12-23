import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';

const AddToolPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  const [image, setImage] = useState(null);
  const [location] = useState({ longitude: 77.216721, latitude: 28.644800 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('condition', condition);
    formData.append('longitude', location.longitude);
    formData.append('latitude', location.latitude);
    formData.append('image', image);

    try {
      await api.post('/tools', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list tool.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          List a New Tool
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Share your tools with the community
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Tool Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Tool Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option>New</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Tool Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
              className="
                w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:bg-purple-600 file:text-white
                hover:file:bg-purple-700
              "
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all
              ${
                loading
                  ? 'bg-gray-700 cursor-not-allowed text-gray-300'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-[1.02]'
              }
            `}
          >
            {loading ? 'Listing Tool...' : 'List Tool'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddToolPage;
