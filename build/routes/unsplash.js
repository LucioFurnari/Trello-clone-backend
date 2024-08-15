"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsplashRouter = void 0;
const express_1 = require("express");
const unsplash_1 = require("../controllers/unsplash");
const router = (0, express_1.Router)();
exports.unsplashRouter = router;
router.get('/unsplash/:pageNumber', unsplash_1.getUnsplashImages);
