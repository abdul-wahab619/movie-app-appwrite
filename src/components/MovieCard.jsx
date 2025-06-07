import React, { useState } from "react";
import MovieModal from "./MovieModal";

const MovieCard = ({
  movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    overview,
  },
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="movie-card group cursor-pointer border-2 border-transparent rounded-xl transition-all duration-300
             hover:scale-105 hover:shadow-xl
             hover:border-transparent hover:bg-gradient-to-br
             hover:from-[#6EE7B7] hover:via-[#3B82F6] hover:to-[#9333EA]
             relative overflow-hidden"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "no-movie.png"
          }
          alt={title || "Movie Poster"}
          className="rounded-t-xl w-full h-[300px] object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <img src="star.svg" alt="star" className="w-4" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>
            <span>•</span>
            <p className="uppercase">{original_language}</p>
            <span>•</span>
            <p>{release_date ? release_date.split("-")[0] : "N/A"}</p>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {overview || "No description available."}
          </p>

          <div className="absolute inset-0 bg-black/50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-sm text-center">
            <p>{overview || "No description available."}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MovieModal
          movie={{
            title,
            vote_average,
            poster_path,
            release_date,
            original_language,
            overview,
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default MovieCard;
