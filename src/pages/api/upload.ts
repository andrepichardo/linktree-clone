import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getUserFromRequest } from '../../../lib/auth';
import fs from 'fs';
import path from 'path';

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

  const { imageData, fileName } = req.body;
  if (!imageData || !fileName) {
    return res.status(400).json({ error: 'Image data and file name required' });
  }

  try {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', user.userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, new Uint8Array(buffer));

    const publicUrl = `/uploads/${user.userId}/${safeName}`;

    await prisma.user.update({
      where: { id: user.userId },
      data: { profile_picture_url: publicUrl },
    });

    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Error uploading image' });
  }
}
