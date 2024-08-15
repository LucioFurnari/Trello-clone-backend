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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnsplashImages = void 0;
const axios_1 = __importDefault(require("axios"));
function getUnsplashImages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.unsplash.com/search/photos?page=${req.params.pageNumber}&query=scenery`, {
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_DEV_KEY}`
                },
                params: req.query
            });
            return res.status(200).json(response.data);
        }
        catch (error) {
            console.error('Failed to fetch images from Unsplash');
            return res.status(500).json({ message: 'Failed to fetch images from Unsplash', error });
        }
    });
}
exports.getUnsplashImages = getUnsplashImages;
;
