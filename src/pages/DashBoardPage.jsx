import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Loader from '../components/Loader';

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [myTools, setMyTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTool, setEditTool] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

  /* ---------------- FETCH BOOKINGS ---------------- */
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/bookings/my-bookings');
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  /* ---------------- FETCH TOOLS ---------------- */
  useEffect(() => {
    if (!user) return;
    const fetchMyTools = async () => {
      try {
        const { data } = await api.get('/tools/my-tools');
        setMyTools(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyTools();
  }, [user]);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (payload) => {
      setBookings(prev => [payload.bookingDetails, ...prev]);
    };

    const handleStatusSocket = (payload) => {
      setBookings(prev =>
        prev.map(b =>
          b._id === payload.bookingDetails._id
            ? payload.bookingDetails
            : b
        )
      );
    };

    socket.on("new_booking_request", handleNewRequest);
    socket.on("booking_status_updated", handleStatusSocket);

    return () => {
      socket.off("new_booking_request", handleNewRequest);
      socket.off("booking_status_updated", handleStatusSocket);
    };
  }, [socket]);

  /* ---------------- UPDATE STATUS ---------------- */
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const { data } = await api.put(
        `/bookings/${bookingId}/status`,
        { status: newStatus }
      );
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? data : b))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading || !user) return <Loader />;

  /* ---------------- DERIVED ---------------- */
  const bookingsAsOwner = bookings.filter(b => b.owner?._id === user._id);
  const bookingsAsBorrower = bookings.filter(b => b.borrower?._id === user._id);

  const formatDateTime = (d) =>
    new Date(d).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------------- UI HELPERS ---------------- */
  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold
      ${status === "pending" && "bg-yellow-500/20 text-yellow-300"}
      ${status === "approved" && "bg-green-500/20 text-green-300"}
      ${status === "declined" && "bg-red-500/20 text-red-300"}
      ${status === "completed" && "bg-purple-500/20 text-purple-300"}
    `}>
      {status}
    </span>
  );

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition
        ${activeTab === id
          ? "bg-purple-600 text-white shadow"
          : "text-gray-400 hover:text-white"}
      `}
    >
      {label}
    </button>
  );

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-2">
          Welcome back, <span className="text-purple-400">{user.name}</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Manage your tools, requests, and activity
        </p>

        {/* TABS */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <TabButton id="requests" label="📥 Requests" />
          <TabButton id="borrowed" label="📦 Borrowed" />
          <TabButton id="uploaded" label="🛠 My Tools" />
        </div>

        {/* REQUESTS */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {bookingsAsOwner.length ? bookingsAsOwner.map(b => (
              <div key={b._id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">
                    {b.borrower.name} wants{" "}
                    <span className="text-purple-400">{b.tool.name}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatDateTime(b.startDate)} → {formatDateTime(b.endDate)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />

                  {b.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(b._id, "approved")}
                        className="px-4 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold">
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(b._id, "declined")}
                        className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )) : <p className="text-gray-400">No requests yet.</p>}
          </div>
        )}

        {/* BORROWED */}
        {activeTab === "borrowed" && (
          <div className="space-y-4">
            {bookingsAsBorrower.map(b => (
              <div key={b._id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5">
                <p>
                  You borrowed <b className="text-purple-400">{b.tool.name}</b>{" "}
                  from <b>{b.owner.name}</b>
                </p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-400">
                    {formatDateTime(b.startDate)} → {formatDateTime(b.endDate)}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MY TOOLS */}
        {activeTab === "uploaded" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTools.map(t => (
              <div key={t._id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
                <img src={t.imageUrl} alt={t.name}
                  className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{t.description}</p>
                  <span className={`text-sm font-semibold ${
                    t.availability ? "text-green-400" : "text-red-400"
                  }`}>
                    {t.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
