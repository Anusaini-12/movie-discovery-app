import express from "express";
import { discover, getDetails, getMovieGenres, getPopular, search } from "../controllers/movieControllers.js";

const router = express.Router();

router.get("/popular", getPopular);
router.get("/genres", getMovieGenres);
router.get("/search", search);
router.get("/discover", discover);
router.get("/:id", getDetails);

export default router;