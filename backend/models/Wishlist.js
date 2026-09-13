import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    movieId: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    posterPath: {
      type: String,
      default: null,
    },

    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same movie from being added
// multiple times by the same user.
wishlistSchema.index(
  { movieId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.model("Wishlist", wishlistSchema);

