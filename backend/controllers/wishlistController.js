import Wishlist from "../models/Wishlist.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
            });
        }

        const wishlist = await Wishlist.find({ userId }).sort({
            createdAt: -1,
        });

        res.json({
            wishlist,
        });
    } catch (error) {
        console.error("Get wishlist error:", error.message);

        res.status(500).json({
            message: "Unable to fetch wishlist",
        });
    }
};

// Add movie to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { movieId, title, posterPath, userId } = req.body;

        if (!movieId || !title || !userId) {
            return res.status(400).json({
                message: "movieId, title and userId are required",
            });
        }

        // Prevent duplicate movies
        const existingMovie = await Wishlist.findOne({
            movieId,
            userId,
        });

        if (existingMovie) {
            return res.status(409).json({
                message: "Movie is already in wishlist",
            });
        }

        const wishlistMovie = await Wishlist.create({
            movieId,
            title,
            posterPath: posterPath || null,
            userId,
        });

        res.status(201).json({
            message: "Movie added to wishlist",
            movie: wishlistMovie,
        });
    } catch (error) {
        console.error("Add wishlist error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Movie is already in wishlist",
            });
        }

        res.status(500).json({
            message: "Unable to add movie to wishlist",
        });
    }
};

// Remove movie from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
            });
        }

        const deletedMovie = await Wishlist.findOneAndDelete({
            movieId: Number(movieId),
            userId,
        });

        if (!deletedMovie) {
            return res.status(404).json({
                message: "Movie not found in wishlist",
            });
        }

        res.json({
            message: "Movie removed from wishlist",
        });
    } catch (error) {
        console.error("Remove wishlist error:", error.message);

        res.status(500).json({
            message: "Unable to remove movie from wishlist",
        });
    }
};