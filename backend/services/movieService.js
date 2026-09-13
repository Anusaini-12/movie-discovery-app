import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";


const tmdbRequest = async (url, config = {}, retries = 3) => {
  try {
    return await axios.get(url, {
      ...config,
      timeout: 10000,
    });
  } catch (error) {
    const isConnectionError =
      error.code === "ECONNRESET" ||
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT";

    if (isConnectionError && retries > 0) {
      console.log(
        `TMDB request failed. Retrying... (${retries} attempts left)`
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return tmdbRequest(url, config, retries - 1);
    }

    throw error;
  }
};

// Convert TMDB movie data into our app's format
const formatMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title || "Untitled",
    poster: movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
      : null,
    rating: movie.vote_average || 0,
    releaseDate: movie.release_date || null,
    overview: movie.overview || "No description available.",
  };
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      page,
    },
  });

  const data = response.data;

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(formatMovie),
  };
};

// Get movie genres
export const getGenres = async () => {
  const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
    },
  });

  return response.data.genres;
};

// Search movies
export const searchMovies = async (query, page = 1) => {
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      query,
      page,
    },
  });

  const data = response.data;

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(formatMovie),
  };
};

// Discover movies with genre, sorting and pagination
export const discoverMovies = async ({
  genre,
  sort = "popular",
  page = 1,
}) => {
  const sortMap = {
    popular: "popularity.desc",
    topRated: "vote_average.desc",
    newest: "primary_release_date.desc",
  };

  const params = {
    api_key: process.env.TMDB_API_KEY,
    language: "en-US",
    page,
    sort_by: sortMap[sort] || sortMap.popular,
  };

  // Add genre filter only when a genre is selected
  if (genre) {
    params.with_genres = genre;
  }

  // Avoid very low-vote movies appearing in top-rated results
  if (sort === "topRated") {
    params["vote_count.gte"] = 100;
  }

  const response = await axios.get(
    `${TMDB_BASE_URL}/discover/movie`,
    {
      params,
    }
  );

  const data = response.data;

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(formatMovie),
  };
};

// Get details of a single movie
export const getMovieDetails = async (movieId) => {
  const response = await axios.get(
    `${TMDB_BASE_URL}/movie/${movieId}`,
    {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "en-US",
      },
    }
  );

  const movie = response.data;

  return {
    id: movie.id,
    title: movie.title || "Untitled",
    poster: movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
      : null,
    rating: movie.vote_average || 0,
    releaseDate: movie.release_date || null,
    overview: movie.overview || "No description available.",
    genres: movie.genres || [],
    runtime: movie.runtime || null,
    tagline: movie.tagline || "",
  };
};