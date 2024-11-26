import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();
    await client.connect();


    // Para to sa pakuha ng information mula sa pet_foods
/////////////////////////////////////////////////
    if (req.method === 'POST') {
        try {
            const result = await client.sql`
                SELECT id, name, price, on_hand AS "onHand" FROM pet_foods;
            `;
            res.status(200).json(result.rows); // Return the fetched data
        } catch (error) {
            console.error("Error fetching pet foods:", error);
            res.status(500).json({ message: "Error fetching pet foods." });
        } finally {
            client.end();
        }
    } else if (req.method === 'PUT') {

        const { name, price, onHand } = req.body; // Destructure values from the request body
        const { id } = req.query;
        if (!id || !name || !price || !onHand) {
            return res.status(400).json({ message: "Missing required fields." });
        }

    // Sa pag Edit tapos kung i sasave yung ma inedit is yun yung upupdate sa database pet_foods
/////////////////////////////////////////////////
        try {
            await client.query(`
                UPDATE pet_foods
                SET name = $1, price = $2, on_hand = $3
                WHERE id = $4`, [ name, price, onHand, id]
        );
            res.status(200).json({ message: "Pet food updated successfully." });
        } catch (error) {
            console.error("Error updating pet food:", error);
            res.status(500).json({ message: "Error updating pet food." });
        } finally {
            client.end();
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
