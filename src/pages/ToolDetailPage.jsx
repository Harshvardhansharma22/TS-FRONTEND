import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import ChatBox from '../components/ChatBox';

const ToolDetailPage = () => {
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTool(null);
    setLoading(true);
    setError('');
    setBookingMessage('');
    setRequestCount(0);

    if (!id) {
      setLoading(false);
      setError("No tool ID provided.");
      return;
    }

    const fetchData = async () => {
      try {
        const { data: toolData } = await api.get(`${VITE_BACKEND_URL}/tools/${id}`);
        setTool(toolData);

        if (user) {
          const { data: bookingsData } = await api.get(`${VITE_BACKEND_URL}/bookings/my-bookings`);
          const userRequestsForThisTool = bookingsData.filter(
            b => b.tool._id === id && b.borrower._id === user._id
          );

          const activeRequest = userRequestsForThisTool.find(
            b => b.status === 'pending' || b.status === 'approved'
          );

          if (activeRequest) {
            setRequestCount(3);
            setBookingMessage(`You have an active request for this tool. Status: ${activeRequest.status}`);
          } else {
            setRequestCount(userRequestsForThisTool.length);
            if (userRequestsForThisTool.length >= 3) {
              setBookingMessage('You have reached the maximum number of requests for this tool.');
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch tool details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleBookingRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both a start and end date.');
      return;
    }

    if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {
      setError('End date & time must be later than start date & time.');
      return;
    }

    setError('');
    setBookingMessage('');

    try {
      await api.post(`${VITE_BACKEND_URL}/bookings`, {
        toolId: tool._id,
        startDate,
        endDate,
      });
      setBookingMessage('Booking request sent successfully!');
      setRequestCount(prev => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send booking request.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!tool) return <p className="text-center mt-10">Tool not found.</p>;

  const canRequest = user && user._id !== tool.owner._id && requestCount < 3;
  const isButtonDisabled = !startDate || !endDate || !canRequest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>
            <img
              src={tool.imageUrl}
              alt={tool.name}
              className="w-full h-72 object-cover rounded-xl mb-8"
            />

            {user && (
              <div className="mt-6 bg-black/40 border border-white/10 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">Chat</h2>
                <ChatBox
                  toUserId={user._id === tool.owner._id ? undefined : tool.owner._id}
                  isOwner={user._id === tool.owner._id}
                />
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {tool.name}
            </h1>

            <p className="text-gray-400 mb-4">{tool.category}</p>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {tool.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300">
                Condition: {tool.condition}
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300">
                Owner: {tool.owner.name}
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300">
                Trust Score: {tool.owner.trustScore}/5
              </span>
            </div>

            {bookingMessage && (
              <p className="mb-4 text-green-400 font-medium">
                {bookingMessage}
              </p>
            )}

            {error && (
              <p className="mb-4 text-red-400 font-medium">
                {error}
              </p>
            )}

            {canRequest && (
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Booking Dates & Time
                </label>

                <div className="flex gap-4">
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-1/2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-1/2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleBookingRequest}
              disabled={isButtonDisabled}
              className={`w-full py-3 rounded-xl font-semibold transition-all
                ${
                  isButtonDisabled
                    ? 'bg-gray-700 cursor-not-allowed text-gray-300'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02]'
                }
              `}
            >
              Request to Borrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
