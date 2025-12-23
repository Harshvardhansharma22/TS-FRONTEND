import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool, onlineUsers }) => {
  const isOnline = onlineUsers.includes(tool.owner._id);

  return (
    <div
      className="
        relative group
        bg-gradient-to-br from-gray-900 via-gray-900 to-black
        border border-white/10
        rounded-2xl
        overflow-hidden
        shadow-lg
        hover:shadow-purple-500/20
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* Accent glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="absolute inset-0 bg-purple-500/10 blur-2xl" />
      </div>

      <Link to={`/tool/${tool._id}`} className="relative z-10 block">
        {/* IMAGE */}
        <div className="h-48 w-full overflow-hidden bg-gray-800">
          <img
            src={tool.imageUrl}
            alt={tool.name}
            className="
              w-full h-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          {/* Tool name */}
          <h3 className="text-lg font-semibold text-white tracking-tight">
            {tool.name}
          </h3>

          {/* Category */}
          <p className="text-sm text-gray-400">
            {tool.category}
          </p>

          {/* Divider */}
          <div className="h-px bg-white/10 my-2" />

          {/* Owner row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Owner
              </span>
              <span className="font-medium text-gray-200">
                {tool.owner.name}
              </span>
            </div>

            {/* Online indicator */}
            {isOnline && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-xs font-semibold text-green-400">
                  Online
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ToolCard;
