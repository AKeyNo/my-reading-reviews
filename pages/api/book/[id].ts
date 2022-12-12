import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    default:
      res.setHeader('Allow', []);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
