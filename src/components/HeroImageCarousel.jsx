import { useEffect, useState } from "react";

const HeroImageCarousel = ({ trendingMovies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!trendingMovies || trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [trendingMovies]);

  const currentMovie = trendingMovies[currentIndex];
  return (
    <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden shadow-lg">
      {/* Hero Image */}
      <img
        src={currentMovie?.poster_url || "./hero.png"}
        alt={currentMovie?.title || "Trending Movie"}
        className="w-full h-full object-none rounded-xl transition-opacity duration-1000 hover:opacity-80 cursor-pointer"
      />
    </div>
  );
};

export default HeroImageCarousel;
