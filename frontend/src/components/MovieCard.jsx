import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.05]"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No Image
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent opacity-80" />

        {/* Rating */}
        <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
          ⭐ {Number(movie.rating || 0).toFixed(1)}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur">
            View Details
          </span>
        </div>
      </div>

      {/* Movie information */}
      <div className="p-4">
        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-white transition group-hover:text-purple-200">
          {movie.title}
        </h2>

        <p className="mt-2 text-xs text-zinc-500">
          {movie.releaseDate || "Release date unavailable"}
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;
