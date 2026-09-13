import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

function Movies() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sort, setSort] = useState("popular");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Used to know whether current results came from search or discover
  const [searchMode, setSearchMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Store the current movie request
  const requestControllerRef = useRef(null);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies/genres");

        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }

        const data = await response.json();

        setGenres(data.genres);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    discoverMovies(1);
  }, []);

  // Discover movies
  const discoverMovies = async (requestedPage = 1) => {
    if (requestControllerRef.current) {
      requestControllerRef.current.abort();
    }

    const controller = new AbortController();

    requestControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");
      setSearchMode(false);
      setPage(requestedPage);

      const params = new URLSearchParams();

      if (selectedGenre) {
        params.append("genre", selectedGenre);
      }

      params.append("sort", sort);
      params.append("page", String(requestedPage));

      const response = await fetch(
        `http://localhost:5000/api/movies/discover?${params.toString()}`,
        {
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to discover movies");
      }

      const data = await response.json();

      setMovies(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      setError(error.message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  // Search movies
  const searchMovies = async () => {
    if (!query.trim()) {
      return;
    }

    if (requestControllerRef.current) {
      requestControllerRef.current.abort();
    }

    const controller = new AbortController();

    requestControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");
      setSearchMode(true);
      setPage(1);

      const response = await fetch(
        `http://localhost:5000/api/movies/search?query=${encodeURIComponent(
          query,
        )}&page=1`,
        {
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to search movies");
      }

      const data = await response.json();

      setMovies(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      setError(error.message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  // Change page
  const goToPage = async (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    if (searchMode) {
      if (requestControllerRef.current) {
        requestControllerRef.current.abort();
      }

      const controller = new AbortController();

      requestControllerRef.current = controller;

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/movies/search?query=${encodeURIComponent(
            query,
          )}&page=${newPage}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();

        setMovies(data.results);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setError(error.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }

      return;
    }

    await discoverMovies(newPage);
  };

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
            Explore
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Discover Movies
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Search for something specific or explore movies by genre,
            popularity, rating, and release date.
          </p>
        </div>

        {/* Search + Filters */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-5">
          {/* Search */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                ⌕
              </span>

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchMovies();
                  }
                }}
                placeholder="Search movies..."
                className="w-full rounded-xl border border-white/10 bg-black/20 px-11 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-400/40 focus:bg-black/30"
              />
            </div>

            <button
              onClick={searchMovies}
              className="w-full rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-zinc-200 sm:w-auto"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-[1fr_1fr_auto]">
            <select
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-zinc-300 outline-none transition focus:border-purple-400/40"
            >
              <option value="">All Genres</option>

              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-zinc-300 outline-none transition focus:border-purple-400/40"
            >
              <option value="popular">Most Popular</option>
              <option value="topRated">Top Rated</option>
              <option value="newest">Newest</option>
            </select>

            <button
              onClick={() => discoverMovies(1)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1] sm:w-auto"
            >
              Apply Filters
            </button>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              !
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-zinc-500">{error}</p>

            <button
              onClick={() => {
                if (searchMode) {
                  searchMovies();
                } else {
                  discoverMovies(page);
                }
              }}
              className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl">
                🎬
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                {searchMode ? "No movies found" : "Start exploring"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                {searchMode
                  ? `We couldn't find any movies matching "${query}". Try a different search.`
                  : "Search for a movie or use the filters above to discover something worth watching."}
              </p>
            </div>
          </div>
        )}

        {/* Movies */}
        {!loading && !error && movies.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
                  {searchMode ? "Search results" : "Movie collection"}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  {searchMode
                    ? `Results for "${query}"`
                    : "Movies you may like"}
                </h2>
              </div>

              <span className="hidden text-sm text-zinc-600 sm:block">
                Page {page} of {totalPages}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-2 sm:mt-12 sm:gap-3">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1 || loading}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30 sm:px-4 sm:text-sm"
              >
                ← Previous
              </button>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-400">
                <span className="text-white">{page}</span>
                <span className="mx-1.5 text-zinc-700">/</span>
                {totalPages}
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages || loading}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30 sm:px-4 sm:text-sm"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Movies;
