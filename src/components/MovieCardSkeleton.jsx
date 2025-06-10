import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MovieCardSkeleton = () => {
  return (
    <div className="movie-card bg-gray-800 rounded-xl overflow-hidden shadow-md">
      <Skeleton height={300} />

      <div className="p-4 space-y-2">
        <Skeleton height={20} width={`80%`} />
        <Skeleton height={14} width={`60%`} />
        <Skeleton height={14} width={`90%`} />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
