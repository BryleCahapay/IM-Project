import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = createClient();

  try {
    await client.connect();

    //Pag UPDATE ng status sa receipts kung ano yung Id niya
    //Kapag pinindot yung Mark as Completed doon siya mag upupdate
    const query = 'UPDATE receipts SET status = $1 WHERE id = $2';
    const values = [status, id];

    const result = await client.query(query, values);

    if (result.rowCount !== null && result.rowCount > 0) {
      res.status(200).json({ message: 'Order status updated successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  } finally {
    await client.end();
  }
}
