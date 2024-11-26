import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'ID is required and must be a string' });
    }

    try {

      const client = createClient();
      await client.connect();

      // Execute the DELETE query
      //Kung gusto ng admin na i delete sa admin orderlist
      //Idedelete kung ano yung id na pinili sa orderlist // gamit yung ID 
//////////////////////////////////////////////////////////////////
      const result = await client.query(
        `DELETE FROM receipts WHERE id = $1 RETURNING *`, 
        [id]
      );

      // Check if a record was deleted
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order deleted successfully', deletedOrder: result.rows[0] });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting order:', error.message);
        return res.status(500).json({ message: 'Failed to delete the order', error: error.message });
      } else {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
