// pages/api/orderlist.ts
import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();

  try {
    await client.connect();

    // Query the database to fetch order details, excluding 'null' and 'pending' statuses
    // fetch galing sa database table receipt, tapos kung not null and status pending ay hindi niya kukunin
    const result = await client.query(`
      SELECT 
        id,
        payment_method,
        order_date,
        cart_items,
        total_amount,
        address,
        contact_number,
        email,
        status 
      FROM receipts
      WHERE status IS NOT NULL AND status != 'pending'
      ORDER BY order_date DESC
    `);

    // Return the results as a JSON response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching order data:', error);
    res.status(500).json({ error: 'Error fetching order data' });
  } finally {
    // Disconnect from the database
    await client.end();
  }
}
