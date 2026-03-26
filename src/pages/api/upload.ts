import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getUserFromRequest } from '../../../lib/auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { imageData } = req.body;
  if (!imageData) {
    return res.status(400).json({ error: 'Image data required' });
  }

  try {
    await prisma.user.update({
      where: { id: user.userId },
      data: { profile_picture_url: imageData },
    });

    return res.status(200).json({ url: imageData });
  } catch (error) {
    return res.status(500).json({ error: 'Error uploading image' });
  }
}
