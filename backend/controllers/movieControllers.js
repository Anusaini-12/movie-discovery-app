import { discoverMovies, getGenres, getMovieDetails, getPopularMovies, searchMovies } from "../services/movieService.js";

export const getPopular = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const data = await getPopularMovies(page);

    res.json(data);
  } catch (error) {
    console.error("Movie API error:", error.message);

    res.status(500).json({
      message: "Unable to fetch movies",
    });
  }
};

export const getMovieGenres = async (req, res) => {
  try {
    const genres = await getGenres();

    res.json({
      genres,
    });
  } catch (error) {
    console.error("Genre API error:", error.message);

    res.status(500).json({
      message: "Unable to fetch genres",
    });
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.query;
    const page = Number(req.query.page) || 1;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const data = await searchMovies(query.trim(), page);

    res.json(data);
  } catch (error) {
    console.error("Movie search error:", error.message);

    res.status(500).json({
      message: "Unable to search movies",
    });
  }
};

export const discover = async (req, res) => {
  try {
    const genre = req.query.genre || "";
    const sort = req.query.sort || "popular";
    const page = Number(req.query.page) || 1;

    const data = await discoverMovies({
      genre,
      sort,
      page,
    });

    res.json(data);
  } catch (error) {
    console.error("Movie discovery error:", error.message);

    res.status(500).json({
      message: "Unable to discover movies",
    });
  }
};

export const getDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Movie ID is required",
      });
    }

    const movie = await getMovieDetails(id);

    res.json(movie);
  } catch (error) {
    console.error("Movie details error:", error.message);

    res.status(500).json({
      message: "Unable to fetch movie details",
    });
  }
};