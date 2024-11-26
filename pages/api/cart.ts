// import { createClient } from '@vercel/postgres';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Initialize the Vercel PostgreSQL client
//   const client = createClient();

//   try {
//     // Connect to the database
//     await client.connect();

//     if (req.method === 'POST') {
//       const { name, price, quantity, email } = req.body;

//       // Validate required fields
//       if (!name || !price || !quantity || !email) {
//         return res.status(400).json({ error: 'Missing required fields' });
//       }

//       // Insert data into the database
//       const query = `
//         INSERT INTO cart_items (name, price, quantity)
//         VALUES ($1, $2, $3, $4)
//         RETURNING id;
//       `;
//       const values = [name, price, quantity, email];

//       const result = await client.query(query, values);

//       // Return a success response with the inserted item's ID
//       res.status(200).json({
//         message: 'Item added to cart successfully',
//         id: result.rows[0].id,
//       });
//     } else {
//       // Handle unsupported methods
//       res.setHeader('Allow', ['POST']);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   } catch (error: any) {
//     console.error('Database error:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   } finally {
//     // Clean up the connection
//     await client.end();
//   }
// }
