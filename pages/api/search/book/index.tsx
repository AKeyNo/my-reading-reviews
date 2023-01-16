import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await handleGET(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// GET /api/search/book?search=...&author=...&publisher=...
// searches for books with the given the book name, author, and/or publisher
async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  let query = '';

  // "+intitle:title+inauthor:author+inpublisher:publisher"
  for (const property in req.query) {
    query += `+in${property}:${req.query[property]}+`;
  }

  try {
    const response = await axios.get(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q: query,
          maxResults: 15,
          key: process.env.GOOGLE_BOOKS_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
