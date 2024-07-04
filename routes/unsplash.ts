import { Router } from "express";
import { getUnsplashImages } from "../controllers/unsplash";

const router = Router();

router.get('/unsplash/:pageNumber', getUnsplashImages);

export { router as unsplashRouter };