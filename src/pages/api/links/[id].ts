import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getUserFromRequest } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Link ID required' });
  }

  try {
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link || link.user_id !== user.userId) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const deleted = await prisma.link.delete({
      where: { id },
      select: { id: true },
    });
    return res.status(200).json(deleted);
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting link' });
  }
}
