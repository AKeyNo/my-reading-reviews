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

// GET /api/search/book?search=...&author=...&publisher=...&startIndex=...
// searches for books with the given the book name, author, and/or publisher
async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  let query = '';

  // "+intitle:title+inauthor:author+inpublisher:publisher"
  // only skips startIndex as it does not fall under the q parameter

  for (const property in req.query) {
    if (property === 'startIndex') continue;
    query += `in${property}:${req.query[property]}+`;
  }
  if (query.length > 0) query = query.slice(0, -1);

  // for each query parameter, add it to the query string except the first one

  try {
    const response = await axios.get(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q: query,
          startIndex: parseInt(req.query.startIndex as string) * 15,
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
