import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const client = createClient();
    await client.connect();

    try {
        if (req.method === 'POST') {
            const { name, price, quantity, customer_id, email } = req.body;
            console.log(req.body);
            // Check if all required fields are provided
            if (!name || !price || !quantity || !customer_id || !email) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if the item already exists in the cart
            const item = await client.query(
                'SELECT customer_id, item_name, quantity FROM cart WHERE customer_id = $1 AND item_name = $2',
                [customer_id, name]
            );

            if (item.rows.length > 0) {
                const prevQ = item.rows[0].quantity;
                await client.query(
                    'UPDATE cart SET quantity = $1 WHERE item_name = $2 AND customer_id = $3',
                    [prevQ + quantity, name, customer_id]
                );
            } else {
                await client.query(
                    'INSERT INTO cart (customer_id, item_name, quantity, price, email) VALUES ($1, $2, $3, $4, $5)',
                    [customer_id, name, quantity, price, email]
                );
            }

            res.status(200).json({ message: 'Item added to cart' });
        } else if (req.method === 'GET') {
            const { userid } = req.query;

            if (!userid) {
                return res.status(400).json({ error: 'Missing customer ID' });
            }

            const data = await client.query(
                'SELECT * FROM cart WHERE customer_id = $1',
                [userid]
            );
            res.status(200).json(data.rows);
        } else if (req.method === "DELETE") {
            const { id } = req.query;
            if(!id){
                return res.status(400).json({error: 'Missing cart id'})
            }

            await client.query(
                'DELETE FROM cart WHERE id = $1',
                [id]
            );

            res.status(200).json({message: "Cart deleted successfully"});
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('ERROR:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.end();
    }
}