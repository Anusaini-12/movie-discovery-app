import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import movieRoute from "./routes/movieRoute.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoute);
app.use("/api/wishlist", wishlistRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Movie Discovery API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});