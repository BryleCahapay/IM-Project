import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const client = createClient();
    await client.connect();

    try {
        const result = await client.sql
            `SELECT * FROM customerAccount WHERE email = ${email} AND password = ${password}`;

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = result.rows[0];

        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error." });
    } finally {
        await client.end();
    }
}