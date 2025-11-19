
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import bcrypt from 'bcrypt';
import { getUserPasswordHash, updateUserPassword } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    try {
      const userId = parseInt(session.user.id as string, 10);
      const passwordHash = await getUserPasswordHash(userId);

      if (!passwordHash || !(await bcrypt.compare(currentPassword, passwordHash))) {
        return res.status(401).json({ message: 'Invalid current password' });
      }

      const newPasswordHashed = await bcrypt.hash(newPassword, 10);
      await updateUserPassword(userId, newPasswordHashed);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
