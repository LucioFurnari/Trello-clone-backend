import axios from "axios";
import { Request, Response } from "express";


export async function getUnsplashImages(req: Request, res: Response) {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos?page=${req.params.pageNumber}&query=scenery`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_DEV_KEY}`
      },
      params: req.query
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Failed to fetch images from Unsplash');
    return res.status(500).json({ message: 'Failed to fetch images from Unsplash', error})
  }
};