// import { createClient } from '@vercel/postgres';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const client = createClient();
//     await client.connect();

//     if (req.method === 'PUT') {
//         const { id, onHand } = req.query;

//         // Validate id and onHand
//         if (typeof id !== 'string' || typeof onHand !== 'string') {
//             return res.status(400).json({ error: 'Invalid request parameters' });
//         }

//         const newOnHand = parseInt(onHand, 10);

//         if (isNaN(newOnHand) || newOnHand < 0) {
//             return res.status(400).json({ error: 'Invalid stock quantity' });
//         }

//         try {
//             // Update the stock in the database
//             const query = 'UPDATE pet_foods SET on_hand = $1 WHERE id = $2 RETURNING *';
//             const values = [newOnHand, id];

//             const result = await client.query(query, values);

//             if (result.rowCount === 0) {
//                 return res.status(404).json({ error: 'Pet food not found' });
//             }

//             const updatedPetFood = result.rows[0];

//             res.status(200).json({ petFood: updatedPetFood });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Internal server error' });
//         } finally {
//             await client.end(); // Close the database connection
//         }
//     } else {
//         res.status(405).json({ error: 'Method Not Allowed' });
//     }
// }
