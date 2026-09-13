import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import api from "../api/axios";

function MovieDetails() {
  const { id } = useParams();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    error: wishlistError,
  } = useWishlist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/movies/${id}`);

        setMovie(response.data);
      } catch (error) {
        console.error("Movie details error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch movie details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-[#05050a] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-[420px] animate-pulse rounded-3xl bg-white/[0.04]" />
        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05050a] px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-400">
            !
          </div>

          <h2 className="mt-4 text-xl font-semibold text-white">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error}
          </p>

          <Link
            to="/movies"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Back to Movies
          </Link>
        </div>
      </main>
    );
  }

  // Movie not found
  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05050a] px-6">
        <div className="text-center">
          <div className="text-5xl">🎬</div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            Movie not found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            We couldn't find the movie you're looking for.
          </p>

          <Link
            to="/movies"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Discover Movies
          </Link>
        </div>
      </main>
    );
  }

  const saved = isInWishlist(movie.id);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05050a] text-white">
      {/* Cinematic backdrop */}
      <section className="relative h-[360px] overflow-hidden sm:h-[450px] lg:h-[520px]">
        {movie.backdrop ? (
          <img
            src={movie.backdrop}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-950/40 via-[#05050a] to-blue-950/30" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Bottom cinematic fade */}
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#05050a] via-[#05050a]/80 to-transparent" />

        {/* Side fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050a]/70 via-transparent to-[#05050a]/40" />

        {/* Back button */}
        <div className="absolute left-0 right-0 top-0">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur-md transition hover:bg-black/50 hover:text-white"
            >
              ← Back to Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Movie content */}
      <section className="relative mx-auto -mt-28 max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Poster */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-zinc-900 text-sm text-zinc-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="pt-2 lg:pt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              Movie Details
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="mt-4 max-w-2xl text-base italic leading-7 text-zinc-400">
                “{movie.tagline}”
              </p>
            )}

            {/* Metadata */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-yellow-400/10 bg-yellow-400/[0.06] px-3 py-1.5 text-sm text-yellow-200">
                ⭐ {Number(movie.rating || 0).toFixed(1)}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-300">
                {movie.releaseDate || "Release date unavailable"}
              </span>

              {movie.runtime && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-300">
                  {movie.runtime} min
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-purple-400/10 bg-purple-400/[0.05] px-3 py-1.5 text-xs font-medium text-purple-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mt-8 max-w-3xl">
              <h2 className="text-lg font-semibold text-white">
                Overview
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
                {movie.overview}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8">
              {wishlistError && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/[0.04] px-4 py-3 text-sm text-red-400">
                  {wishlistError}
                </div>
              )}

              <button
                onClick={() => {
                  if (saved) {
                    removeFromWishlist(movie.id);
                  } else {
                    addToWishlist(movie);
                  }
                }}
                className={`rounded-xl px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  saved
                    ? "border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {saved
                  ? "♥ Remove from Wishlist"
                  : "♡ Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;
