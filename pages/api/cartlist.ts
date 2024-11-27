import { NextApiRequest, NextApiResponse } from 'next'; // Import these types
import { createClient } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email || Array.isArray(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    try {
      const client = createClient();
      await client.connect();

      // Fetch cart items based on the email
      const result = await client.query(
        'SELECT item_name, quantity, price FROM cart WHERE email = $1',
        [email] // Use the email parameter to fetch specific cart items
      );

      if (result.rows.length > 0) {
        // Respond with the cart items
        res.status(200).json(result.rows);
      } else {
        res.status(404).json({ message: 'No cart items found' });
      }

      await client.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
