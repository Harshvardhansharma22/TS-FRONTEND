import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ToolCard from '../components/ToolCard';

/* ================= HERO ================= */
const HeroSection = () => (
  <header className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-indigo-800 to-gray-900 text-white rounded-b-3xl shadow-2xl">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#a855f7,_transparent_60%)]" />

    <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Find & Share <br />
          <span className="text-yellow-300">Tools Near You</span>
        </h1>

        <p className="mt-6 text-lg text-purple-100 leading-relaxed">
          Borrow instead of buying. Save money, reduce waste,
          and build trust with people around you — all within 50km.
        </p>

        <div className="mt-8 flex gap-4">
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm">
            🌍 Local
          </span>
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm">
            🔒 Trusted
          </span>
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm">
            ♻️ Sustainable
          </span>
        </div>
      </div>

      <div className="text-8xl drop-shadow-lg animate-pulse">
        🛠️
      </div>
    </div>
  </header>
);

/* ================= STATES ================= */
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-gray-300">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-purple-500 border-opacity-70" />
    <p className="mt-6 text-xl tracking-wide">
      Scanning nearby neighborhoods…
    </p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="max-w-xl mx-auto mt-12 bg-red-950/60 backdrop-blur border border-red-700 text-red-200 px-6 py-8 rounded-xl shadow-xl">
    <h2 className="text-2xl font-bold mb-2">⚠ Something went wrong</h2>
    <p className="opacity-90">{message}</p>
  </div>
);

/* ================= PAGE ================= */
const HomePage = () => {
  const [tools, setTools] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lat = 28.644800;
        const lng = 77.216721;
        const dist = 50000;

        const toolsResponse = await api.get(
          `/tools/nearby?lat=${lat}&lng=${lng}&dist=${dist}`
        );
        setTools(toolsResponse.data || []);

        try {
          const usersResponse = await api.get('/users/online');
          setOnlineUsers(usersResponse.data.map(u => u._id));
        } catch {}
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Network issue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        <HeroSection />
        <LoadingState />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <HeroSection />

      {error && <ErrorState message={error} />}

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold tracking-tight">
            Available Tools
            <span className="text-purple-400"> Within 50km</span>
          </h2>

          <span className="text-sm text-gray-400">
            {tools.length} tools found
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {tools.length > 0 ? (
            tools.map(tool => (
              <div
                key={tool._id}
                className="transition transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                <ToolCard tool={tool} onlineUsers={onlineUsers} />
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white/5 backdrop-blur-md rounded-xl p-16 text-center border border-white/10">
              <p className="text-2xl font-semibold mb-2">
                😕 No tools nearby
              </p>
              <p className="text-gray-400">
                Try again later or expand your radius.
              </p>
            </div>
          )}
        </div>

        {/* WHY SHARE */}
        <section className="mt-32 grid md:grid-cols-3 gap-10 text-center">
          {[
            ['💸 Save Money', 'Borrow tools instead of buying rarely-used items.'],
            ['🤝 Build Trust', 'Meet neighbors and grow a local community.'],
            ['🌱 Go Green', 'Reduce waste and promote sustainability.']
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition"
            >
              <h3 className="text-2xl font-bold mb-4">{title}</h3>
              <p className="text-gray-300">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-24 py-6 text-center text-sm text-gray-400 border-t border-white/10">
        © 2025 ToolSwap — Built with ❤️ for local communities
      </footer>
    </div>
  );
};

export default HomePage;
