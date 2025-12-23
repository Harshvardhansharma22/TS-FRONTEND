import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Reusable Animation Wrapper ---
const FadeIn = ({ children, delay = 0, direction = "up" }) => (
  <motion.div
    initial={{ opacity: 0, y: direction === "up" ? 30 : 0, x: direction === "left" ? -30 : 0 }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
  >
    {children}
  </motion.div>
);

// 🌌 Refined Hero Component
const PublicHero = () => (
  <header className="relative min-h-[90vh] flex items-center bg-[#050505] text-white pt-20 pb-32 px-4 overflow-hidden">
    {/* Animated Background Atmosphere */}
    <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[50%] bg-blue-600/10 blur-[100px] rounded-full" />
    </div>
    
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 w-full">
      <div className="md:w-7/12 text-center md:text-left">
        <FadeIn direction="left">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 rounded-full">
            Community First • 100% Free
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Borrow. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 italic">
              Never Pay.
            </span>
          </h1>
          <p className="text-lg sm:text-xl opacity-70 max-w-xl mb-12 font-light text-gray-300 leading-relaxed">
            The neighborhood inventory you've been waiting for. Join thousands of swappers sharing resources with <span className="text-white font-medium underline decoration-purple-500 decoration-2 underline-offset-4">zero rental fees</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-5">
            <Link
              to="/register"
              className="px-10 py-5 bg-white text-black font-black rounded-full shadow-2xl hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 uppercase text-sm tracking-widest"
            >
              Join the Swap
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 border border-white/10 text-white font-bold rounded-full hover:bg-white/5 transition-all text-sm tracking-widest uppercase backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </FadeIn>
      </div>

      <div className="hidden md:block md:w-5/12 relative">
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative text-[14rem] drop-shadow-[0_0_40px_rgba(168,85,247,0.4)] text-center"
        >
          <span role="img" aria-label="Toolbox">🧰</span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full animate-ping opacity-20" />
        </motion.div>
      </div>
    </div>
  </header>
);

// 📊 Premium Stats Section
const PublicStats = () => (
  <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-gray-900/40 backdrop-blur-xl border border-white/5 p-10 md:p-14 rounded-[3rem] shadow-2xl">
      {[
        { label: 'Active Neighbors', value: '15k+' },
        { label: 'Free Tool Swaps', value: '42k+' },
        { label: 'Money Saved', value: '$250k' },
        { label: 'Platform Fee', value: '$0' },
      ].map((stat, i) => (
        <FadeIn key={i} delay={i * 0.1}>
          <div className="text-center group">
            <h4 className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">{stat.value}</h4>
            <p className="text-gray-500 uppercase tracking-[0.2em] text-[10px] font-black">{stat.label}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ✨ Card-based Features Component
const PublicFeatures = () => (
  <section className="max-w-7xl mx-auto py-32 px-4">
    <FadeIn>
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
          A Better Way to <span className="italic text-gray-500">Build.</span>
        </h2>
        <div className="h-1.5 w-24 bg-purple-600 mx-auto rounded-full" />
      </div>
    </FadeIn>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: '📝', title: 'Lend Your Tools', color: 'purple', text: 'Share your gear that sits idle. You keep ownership; your neighbors get a helping hand.' },
        { icon: '🔍', title: 'Borrow for Free', color: 'indigo', text: 'Find specialized tools nearby for free. Return them clean, and pay it forward.' },
        { icon: '🛡️', title: 'Trust First', color: 'pink', text: 'Verified profiles and peer reviews ensure your tools are treated like their own.' }
      ].map((feature, i) => (
        <FadeIn key={i} delay={i * 0.2}>
          <div className="h-full bg-[#0a0a0a] p-12 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${feature.color}-500/5 blur-3xl group-hover:opacity-100 opacity-0 transition-opacity`} />
            <div className="text-6xl mb-8 transform group-hover:-rotate-12 transition-transform duration-300">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              {feature.text}
            </p>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// 🏠 Main Component
const PublicHome = () => {
  return (
    <div className="min-h-screen bg-[#050505] font-sans antialiased text-[#f5f5f5] selection:bg-purple-500 selection:text-white">
      <PublicHero />
      <PublicStats />
      
      {/* Narrative Section */}
      <section className="max-w-5xl mx-auto py-32 text-center px-6">
        <FadeIn>
          <div className="space-y-10">
            <h3 className="text-purple-500 font-mono tracking-[0.4em] uppercase text-xs font-bold">The Manifesto</h3>
            <p className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
              "Owning is expensive. <br />
              <span className="text-gray-600 italic">Sharing is the future.</span>"
            </p>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">
              We're building a world where every tool in the neighborhood is a shared asset. Less waste, more community.
            </p>
          </div>
        </FadeIn>
      </section>

      <PublicFeatures />

      {/* Dynamic CTA */}
      <section className="px-4 pb-32">
        <div className="max-w-7xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-gradient-to-br from-purple-700 to-indigo-800 rounded-[4rem] p-16 md:p-28 text-center overflow-hidden">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-[0.9] tracking-tighter">
                Ready to build <br /> together?
              </h2>
              <Link 
                to="/register" 
                className="inline-block bg-white text-black px-14 py-6 text-lg font-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform uppercase tracking-widest"
              >
                Join for $0 Forever
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#020202] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">ToolSwap.</h2>
            <p className="text-gray-500 max-w-xs leading-relaxed">The world's first decentralised community tool library. Built by neighbors, for neighbors.</p>
          </div>
          <div className="flex gap-20 md:justify-end">
            <div className="space-y-6">
              <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Platform</span>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><Link to="/register" className="hover:text-purple-400 transition">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-purple-400 transition">Login</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Community</span>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><Link to="#" className="hover:text-purple-400 transition">Trust & Safety</Link></li>
                <li><Link to="#" className="hover:text-purple-400 transition">How it Works</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;