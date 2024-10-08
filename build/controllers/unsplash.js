"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnsplashImages = void 0;
function getUnsplashImages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.unsplash.com/photos/random?count=${req.params.pageNumber}&query=nature`, {
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_DEV_KEY}`
                },
            });
            const images = yield response.json();
            // Filter out only the image data you need (e.g., id, urls, description)
            const filteredImages = images.map((image) => ({
                id: image.id,
                urls: image.urls,
                alt_description: image.alt_description,
                // Add any other fields you want to keep
            }));
            return res.status(200).json(filteredImages);
        }
        catch (error) {
            console.error('Failed to fetch images from Unsplash');
            return res.status(500).json({ message: 'Failed to fetch images from Unsplash', error });
        }
    });
}
exports.getUnsplashImages = getUnsplashImages;
;
