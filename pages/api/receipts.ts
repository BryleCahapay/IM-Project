import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

interface Receipt {
  email: string;
  total_amount: number;
  order_date: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Create a new PostgreSQL client
    const client = createClient();
    await client.connect();

    // Fetch data from the receipts table para to sa orderlist sa admin
    const query = 'SELECT id, email, total_amount, order_date, status FROM receipts';
    const result = await client.query<Receipt>(query);

    // Close the connection
    await client.end();

    // Send the fetched data as the response
    res.status(200).json({ receipts: result.rows });
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
