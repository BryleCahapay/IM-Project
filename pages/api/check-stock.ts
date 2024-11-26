import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { itemName, quantity } = req.body;

    const client = createClient();
    await client.connect();

    try {
      // Query to check if enough stock is available

      //Sa pag select sa database on_hand i chcheck niya kung 0 yung stock
      const result = await client.sql`
        SELECT on_hand
        FROM pet_foods
        WHERE name = ${itemName}
      `;

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      const availableStock = result.rows[0].on_hand;

      if (availableStock >= quantity) {
        // Stock is sufficient
        return res.status(200).json({ success: true });
      } else {
        // Not enough stock
        return res.status(200).json({ success: false, message: 'Not enough stock available' });
      }
    } catch (error) {
      console.error('Error checking stock:', error);
      res.status(500).json({ success: false, message: 'Error checking stock' });
    } finally {
      client.end();
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
