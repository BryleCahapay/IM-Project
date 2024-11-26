// import { createClient } from '@vercel/postgres';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const client = createClient();

//   try {
//     await client.connect();

//     // Query to fetch completed orders

//     //Select lahat ng information sa receipts table na completed ang nasa status
//     const result = await client.query(
//       'SELECT id, customer_name, items, total_amount, status FROM receipts WHERE status = $1',
//       ['Completed']
//     );

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   } finally {
//     await client.end();
//   }
// }
