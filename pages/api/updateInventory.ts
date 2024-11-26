import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();
    await client.connect();

    if (req.method === 'POST') {
        const { cartItems } = req.body;
        

        console.log("Received cart items:", cartItems);

        try {
            // Begin a transaction
            await client.sql`BEGIN`;

            // Loop through each item in cartItems and update inventory
            for (const item of cartItems) {
                console.log(`Attempting to update ${item.name} with quantity ${item.quantity}`);

                // Update sa inventory pag na confirm na sa payment method kung ilan at kung ano yung item
                // Update inventory if enough stock is available
                const result = await client.sql`
                    UPDATE pet_foods
                    SET on_hand = on_hand - ${item.quantity}
                    WHERE name = ${item.name} AND on_hand >= ${item.quantity}
                    RETURNING name, on_hand;
                `;

                if (result.rowCount === 0) {
                    console.log(`Failed to update ${item.name}: Insufficient stock or item not found`);
                } else {
                    console.log(`Updated ${item.name}. New stock: ${result.rows[0].on_hand}`);
                }
            }

            // Commit the transaction if all updates are successful
            await client.sql`COMMIT`;

            res.status(200).json({ message: 'Inventory updated successfully' });
        } catch (error) {
            console.error('Error updating inventory:', error);
            await client.sql`ROLLBACK`; // Rollback if an error occurs
            res.status(500).json({ message: 'Error updating inventory' });
        } finally {
            client.end();
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
