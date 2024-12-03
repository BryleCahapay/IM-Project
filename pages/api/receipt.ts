import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

interface ReceiptRow {
  payment_method: string;
  cart_items: string;
  total_amount: number;
  address: string;
  contact_number: string;
  order_date: string;
  email: string;
  status: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();
  await client.connect();

  if (req.method === 'POST') {
    // Handle POST request for saving receipt
    const { paymentMethod, cartItems, totalAmount, address, contactNumber, orderDate, email, status } = req.body;

    if (!paymentMethod || !cartItems || !totalAmount || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cartItemsString = cartItems.join(', ');  // Join item names into a comma-separated string

    try {
      const query = `
        INSERT INTO receipts (payment_method, cart_items, total_amount, address, contact_number, order_date, email, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      const values = [paymentMethod, cartItemsString, totalAmount, address, contactNumber, orderDate, email, status];
      await client.query(query, values);
      res.status(200).json({ message: 'Receipt saved successfully' });
    } catch (error) {
      console.error('Error saving receipt:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await client.end();
    }
  } else if (req.method === 'GET') {
    // Handle GET request for fetching cart history by email
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const query = 'SELECT * FROM receipts WHERE email = $1';
      const result = await client.query(query, [email]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No receipts found for this email' });
      }

      const cartItems = result.rows.map((row: ReceiptRow) => {
        let cartItemsParsed: string[] = [];
        try {
          // If it's a stringified array, parse it back into an array of names
          cartItemsParsed = row.cart_items.split(',').map((item: string) => item.trim());
        } catch (error) {
          console.error('Error parsing cart items:', error);
          cartItemsParsed = row.cart_items.split(',').map((item: string) => item.trim());
        }

        return {
          paymentMethod: row.payment_method,
          cartItems: cartItemsParsed,
          totalAmount: row.total_amount,
          address: row.address,
          contactNumber: row.contact_number,
          orderDate: row.order_date,
          email: row.email,
        };
      });

      res.status(200).json({ cartItems });
    } catch (error) {
      console.error('Error fetching receipts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await client.end();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
