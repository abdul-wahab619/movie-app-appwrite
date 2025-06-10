import { useEffect, useState } from "react";
import "./App.css";
import { useDebounce } from "react-use";
import { useQuery } from "@tanstack/react-query";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { updateSearchCount, getTrendingMovies } from "../appwrite";
import MovieCardSkeleton from "./components/MovieCardSkeleton";
import HeroImageCarousel from "./components/HeroImageCarousel";
import Navbar from "./components/Navbar";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.example.com";
const API_KEY = import.meta.env.VITE_API_KEY || "your_api_key_here";

const API_OPTIONS = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const fetchMovies = async (query) => {
  const endpoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&sort_by=popularity.desc`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, API_OPTIONS);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No movies found. Please try a different search.");
  }

  if (query && data.results.length > 0) {
    await updateSearchCount(query, data.results[0]);
  }

  return data.results;
};

const fetchTrendingMovies = async () => {
  return await getTrendingMovies();
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [hookIndex, setHookIndex] = useState(0);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const {
    data: allMovies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies", debouncedSearchTerm],
    queryFn: () => fetchMovies(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm || debouncedSearchTerm === "", // Trigger on mount & search
  });

  const { data: trendingMovies = [], isError: trendingError } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovies,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHookIndex((prev) => (prev + 1) % hookLines.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);
  const hookLines = [
    "Find <span class='text-gradient'>movies</span> You'll Enjoy without the Hassle",
    "Discover Films Tailored to Your Taste—<span class='text-gradient'>Effortlessly</span>",
    "Search Less, Watch More—<span class='text-gradient'>Movies</span>",
    "Your Next Favorite <span class='text-gradient'>Movie</span> Is Just a Click Away",
    "Streamline Your Search, Maximize Your <span class='text-gradient'>Movie Time</span>",
    "Smart Movie Picks, Without the <span class='text-gradient'>Endless Scrolling</span>",
  ];
  return (
    <main>
      <Navbar />
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <HeroImageCarousel trendingMovies={trendingMovies} />
          <h1
            className="text-center text-2xl md:text-4xl font-bold"
            dangerouslySetInnerHTML={{ __html: hookLines[hookIndex] }}
          />
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Most Searched Movies</h2>
            {trendingError && (
              <p className="text-red-500">Failed to load trending movies.</p>
            )}
            <div className="movies">
              {isLoading ? (
                <Spinner />
              ) : (
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li
                      key={movie.$id || index}
                      className="min-w-[230px] flex flex-row items-center opacity-0 animate-fadeInUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <p className="fancy-text mt-[22px] text-nowrap">
                        {index + 1}
                      </p>
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-[127px] h-[163px] rounded-lg object-cover -ml-3.5 hover:scale-105 transition-transform duration-300 hover:w-full hover:transform-3d"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isError && <p className="text-red-500">{error.message}</p>}
          <div className="movies">
            {isLoading ? (
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <li key={index}>
                    <MovieCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : allMovies.length > 0 ? (
              <ul>
                {allMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            ) : (
              <p>No movies found.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
