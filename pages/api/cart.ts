// import { createClient } from '@vercel/postgres';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const client = createClient();

//   try {
//     await client.connect();

//     if (req.method === 'POST') {
//       const { email, name, price, quantity } = req.body;

//       if (!email || !name || !price || !quantity) {
//         return res.status(400).json({ message: 'Missing required fields' });
//       }

//       // Insert or update item in the database
//       const query = `
//         INSERT INTO cart_items (email, name, price, quantity)
//         VALUES ($1, $2, $3, $4)
//         ON CONFLICT (email, name)
//         DO UPDATE SET quantity = cart_items.quantity + $4
//         RETURNING *;
//       `;
//       const values = [email, name, price, quantity];
//       const result = await client.query(query, values);

//       // Return the added or updated item
//       res.status(200).json({ message: 'Item added to cart', item: result.rows[0] });
//     } else {
//       // Handle unsupported HTTP methods
//       res.status(405).json({ message: 'Method not allowed' });
//     }
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
//     res.status(500).json({ message: 'Database error', error: errorMessage });
//   } finally {
//     await client.end();
//   }
// }
