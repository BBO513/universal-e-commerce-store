
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { users } from '../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    res.status(201).json({ message: 'User created' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
