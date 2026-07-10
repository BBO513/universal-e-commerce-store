import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import path from 'path';
import fs from 'fs/promises';

const themePath = path.join(process.cwd(), 'config', 'theme.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }

  if (req.method === 'GET') {
    try {
      const content = await fs.readFile(themePath, 'utf8');
      const theme = JSON.parse(content);
      return res.status(200).json({ theme });
    } catch (error) {
      console.error('Error reading theme config:', error);
      return res.status(500).json({ message: 'Unable to load theme config.' });
    }
  }

  if (req.method === 'POST') {
    const updatedTheme = req.body;

    if (!updatedTheme || typeof updatedTheme !== 'object') {
      return res.status(400).json({ message: 'Invalid theme payload.' });
    }

    try {
      await fs.writeFile(themePath, JSON.stringify(updatedTheme, null, 2), 'utf8');
      return res.status(200).json({ message: 'Theme config updated successfully.' });
    } catch (error) {
      console.error('Error writing theme config:', error);
      return res.status(500).json({ message: 'Unable to save theme config.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
