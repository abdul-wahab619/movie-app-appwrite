import React, { useEffect, useRef } from "react";

const MovieModal = ({ movie, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-slate-900 rounded-xl shadow-lg w-full max-w-3xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-2xl font-bold hover:text-red-500"
        >
          ×
        </button>
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "no-movie.png"
            }
            alt={movie.title}
            className="w-full md:w-1/3 rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <p className="text-gray-400 mt-1">
              Release: {movie.release_date || "N/A"}
            </p>
            <p className="text-gray-400">Language: {movie.original_language}</p>
            <p className="text-gray-400">Rating: {movie.vote_average}</p>
            <p className="mt-4 text-gray-500">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
