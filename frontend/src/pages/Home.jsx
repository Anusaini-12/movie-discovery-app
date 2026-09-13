import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/movies/popular?page=1",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        setMovies(data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05050a] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]"
              >
                <div className="aspect-[2/3] animate-pulse bg-white/[0.06]" />

                <div className="p-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                  <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-white/[0.06]" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05050a] px-6">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl">
            !
          </div>

          <h2 className="text-xl font-semibold text-white">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-zinc-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#05050a] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Night sky glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.10),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-400 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              YOUR MOVIE DESTINATION
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Discover your next
              <span className="mt-2 block bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent">
                favorite movie.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Explore popular movies, discover new genres, find something worth
              watching, and save the movies you want to remember.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link
                to="/movies"
                className="w-full rounded-xl bg-white px-6 py-3.5 text-center text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-zinc-200 sm:w-auto"
              >
                Explore Movies
              </Link>

              <Link
                to="/wishlist"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-center text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.08] sm:w-auto"
              >
                ♡ My Wishlist
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#05050a] to-transparent" />
      </section>

      {/* Popular Movies */}
      <section className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              Trending now
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Popular Movies
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Movies people are watching right now.
            </p>
          </div>

          <Link
            to="/movies"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white sm:block"
          >
            View all →
          </Link>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <p className="text-zinc-400">
              No popular movies available right now.
            </p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/movies"
            className="text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            View all movies →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
