import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create/get a unique ID for this browser
  const getUserId = () => {
    let userId = localStorage.getItem("moviehub-user-id");

    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("moviehub-user-id", userId);
    }

    return userId;
  };

  // Load wishlist from MongoDB
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getUserId();

      const response = await fetch(
        `http://localhost:5000/api/wishlist?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();

      setWishlist(data.wishlist);
    } catch (error) {
      console.error("Wishlist fetch error:", error.message);
      setError("Unable to load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add movie to wishlist
  const addToWishlist = async (movie) => {
    try {
      setError("");

      const userId = getUserId();

      const response = await fetch(
        "http://localhost:5000/api/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: movie.id,
            title: movie.title,
            posterPath: movie.poster,
            userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError("Movie is already in your wishlist.");
        } else {
          setError("Unable to add movie to wishlist.");
        }

        return;
      }

      setWishlist((currentWishlist) => [
        ...currentWishlist,
        data.movie,
      ]);
    } catch (error) {
      console.error("Add wishlist error:", error.message);
      setError("Something went wrong. Please try again.");
    }
  };

  // Remove movie from wishlist
  const removeFromWishlist = async (movieId) => {
    try {
      setError("");

      const userId = getUserId();

      const response = await fetch(
        `http://localhost:5000/api/wishlist/${movieId}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove movie from wishlist");
      }

      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (movie) => movie.movieId !== Number(movieId)
        )
      );
    } catch (error) {
      console.error("Remove wishlist error:", error.message);
      setError("Unable to remove movie from wishlist.");
    }
  };

  // Check whether a movie is already saved
  const isInWishlist = (movieId) => {
    return wishlist.some(
      (movie) => movie.movieId === Number(movieId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

