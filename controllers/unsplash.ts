import { Request, Response } from "express";

export async function getUnsplashImages(req: Request, res: Response) {
  try {
    const response = await fetch(`https://api.unsplash.com/photos?page=${req.params.pageNumber}&query=scenery`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_DEV_KEY}`
      },
    });

    const images = await response.json();

    // Filter out only the image data you need (e.g., id, urls, description)
    const filteredImages = images.map((image: any) => ({
      id: image.id,
      urls: image.urls,
      alt_description: image.alt_description,
      // Add any other fields you want to keep
    }));

    return res.status(200).json(filteredImages);
  } catch (error) {
    console.error('Failed to fetch images from Unsplash');
    return res.status(500).json({ message: 'Failed to fetch images from Unsplash', error})
  }
};