import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getUserFromRequest } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { user_id } = req.query;
    if (!user_id || typeof user_id !== 'string') {
      return res.status(400).json({ error: 'user_id required' });
    }

    try {
      const links = await prisma.link.findMany({
        where: { user_id },
        select: { id: true, title: true, url: true },
      });
      return res.status(200).json(links);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching links' });
    }
  }

  if (req.method === 'POST') {
    const user = getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const { title, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL required' });
    }

    try {
      const link = await prisma.link.create({
        data: { title, url, user_id: user.userId },
        select: { id: true, title: true, url: true },
      });
      return res.status(201).json(link);
    } catch (error) {
      return res.status(500).json({ error: 'Error creating link' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
