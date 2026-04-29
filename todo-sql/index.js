import env from "dotenv";
import express from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
env.config({
    path: "./.env"
})

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING
});

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
        res.status(400).json({
            msg: "All fields are required."
        });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
            [username, email, hashedPassword]
        );

        return res.status(201).json({
            msg: "Signup done.",
            id: newUser.rows[0].id
        });

    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({
                msg: "User already exists"
            });
        }

        console.error(err);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }

});

app.post("/signin", async (req, res) => {

});

app.listen(8000, () => {
    console.log("Starting server on http://localhost:8000");
});

