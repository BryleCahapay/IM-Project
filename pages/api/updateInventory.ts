import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();
  await client.connect();

  if (req.method === 'POST') {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Invalid cart items data' });
    }

    try {
      // Begin a transaction
      await client.sql`BEGIN`;

      // Process each item
      const updatedItems = [];
      for (const item of cartItems) {
        const { item_name, quantity } = item;

        if (!item_name || !quantity || quantity <= 0) {
          continue; // Skip invalid items
        }

        // Update inventory if enough stock is available
        const result = await client.sql`
          UPDATE pet_foods
          SET on_hand = on_hand - ${quantity}
          WHERE name = ${item_name} AND on_hand >= ${quantity}
          RETURNING name, on_hand;
        `;

        if (result.rowCount === 0) {
          // If no rows are updated, it means insufficient stock
          return res.status(400).json({
            message: `Insufficient stock for ${item_name}`,
          });
        }

        updatedItems.push(result.rows[0]);
      }

      // Commit the transaction
      await client.sql`COMMIT`;

      return res.status(200).json({
        message: 'Inventory updated successfully',
        updatedItems,
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      await client.sql`ROLLBACK`;
      return res.status(500).json({ message: 'Error updating inventory' });
    } finally {
      client.end();
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
