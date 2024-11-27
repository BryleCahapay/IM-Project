import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const client = createClient();
            await client.connect();

            const { name, price, quantity, customer_id } = req.body;

            // Fetch the email of the customer using user_id
            const emailResult = await client.query(
                'SELECT email FROM customeraccount WHERE customer_id = $1',
                [customer_id]
            );

            // If email is found
            if (emailResult.rows.length > 0) {
                const email = emailResult.rows[0].email;

                // Insert the item into the cart table
                await client.query(
                    'INSERT INTO cart (customer_id, item_name, quantity, price, email) VALUES ($1, $2, $3, $4, $5)',
                    [customer_id, name, quantity, price, email]
                );

                res.status(200).json({ message: 'Item added to cart' });
            } else {
                res.status(400).json({ error: 'User not found' });
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
