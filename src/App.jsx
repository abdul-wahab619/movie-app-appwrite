import { useEffect, useState } from "react";
import "./App.css";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { updateSearchCount, getTrendingMovies } from "../appwrite";

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
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [allMovies, setAllMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&sort_by=popularity.desc`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        setAllMovies([]);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (
        data.Response === "false" ||
        !data.results ||
        data.results.length === 0
      ) {
        setErrorMessage("No movies found. Please try a different search.");
        setAllMovies([]);
        return;
      }

      setAllMovies(data.results || []);
      if (query && data.results.length > 0) {
        // Update search count in Appwrite
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch movies. Please try again later.");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const tMovies = await getTrendingMovies();
      setTrendingMovies(tMovies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero image" />
          <h1>
            Find <span className="text-gradient">movies</span> You'll Enjoy
            without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="movies">
            {isLoading ? (
              <Spinner />
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
