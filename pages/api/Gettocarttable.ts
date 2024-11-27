// import { createClient } from '@vercel/postgres';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const client = createClient();
//   await client.connect();

//   try {
//     const result = await client.query('SELECT * FROM cart'); // Adjust based on your actual table structure
//     const cartItems = result.rows;
    
//     res.status(200).json({ success: true, items: cartItems });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Failed to fetch cart items from the database.' });
//   } finally {
//     await client.end();
//   }
// }
