import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'Missing required fields: id and status' });
  }

  const client = createClient();

  try {
    await client.connect();

    // Using stored Procedure for updating the order status
    const query = 'CALL update_order_status($1, $2)';
    const values = [id, status];

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Order with ID ${id} not found` });
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  } finally {
    await client.end();
  }
}
