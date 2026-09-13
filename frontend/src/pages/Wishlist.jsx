import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const {
    wishlist,
    loading,
    error,
    removeFromWishlist,
  } = useWishlist();

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#05050a] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-white/[0.06]" />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]"
              >
                <div className="aspect-[2/3] animate-pulse bg-white/[0.06]" />

                <div className="p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />

                  <div className="mt-4 h-9 animate-pulse rounded-lg bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#05050a] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute -left-40 top-[500px] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
            Your collection
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                My Wishlist
              </h1>

              <p className="mt-3 text-sm text-zinc-500 sm:text-base">
                Movies you've saved for later.
              </p>
            </div>

            {wishlist.length > 0 && (
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-400">
                <span className="font-semibold text-white">
                  {wishlist.length}
                </span>{" "}
                {wishlist.length === 1 ? "movie" : "movies"}
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-sm text-red-400">
                !
              </div>

              <div>
                <p className="font-medium text-white">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {wishlist.length === 0 && (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center backdrop-blur">
            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-4xl shadow-2xl shadow-purple-950/20">
                ♡
              </div>

              <h2 className="mt-7 text-2xl font-semibold text-white">
                Your wishlist is waiting
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Save movies you want to watch later and they'll appear
                here.
              </p>

              <Link
                to="/movies"
                className="mt-7 inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-zinc-200"
              >
                Discover Movies
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Movies */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {wishlist.map((movie) => (
              <div
                key={movie.movieId}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.05]"
              >
                {/* Poster */}
                <Link
                  to={`/movie/${movie.movieId}`}
                  className="block"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                    {movie.posterPath ? (
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        No Image
                      </div>
                    )}

                    {/* Poster gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Wishlist badge */}
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-sm text-pink-300 backdrop-blur">
                      ♥
                    </div>
                  </div>
                </Link>

                {/* Movie information */}
                <div className="p-4">
                  <Link to={`/movie/${movie.movieId}`}>
                    <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-white transition group-hover:text-purple-200">
                      {movie.title}
                    </h2>
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(movie.movieId)}
                    className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-zinc-400 transition hover:border-red-400/20 hover:bg-red-500/[0.06] hover:text-red-300"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue browsing */}
        {wishlist.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              ← Continue exploring
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;