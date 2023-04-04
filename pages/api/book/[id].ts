import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../lib/types/supabase';

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

// GET /api/book/[id]
// gets the respective book contents from the Google Books and returns it
async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  });

  try {
    // fetch the book from the Google Books
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );

    const { data: bookStats, error: bookStatsResponseError } =
      await supabaseServerClient.rpc('get_book_stats', {
        book_id_to_check: id as string,
      });

    if (bookStatsResponseError)
      return res.status(200).json(response.data.volumeInfo);

    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser();

    if (!user)
      return res
        .status(200)
        .json({
          volumeInfo: response.data.volumeInfo,
          bookStats: bookStats[0],
        });

    const { data: userBookInformation } = await supabaseServerClient
      .from('read_list')
      .select('*')
      .eq('user_id', user.id)
      .eq('book_id', id)
      .maybeSingle();

    return res.status(200).json({
      volumeInfo: response.data.volumeInfo,
      userBookInformation,
      bookStats: bookStats[0],
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
