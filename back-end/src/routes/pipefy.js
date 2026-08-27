import 'dotenv/config';
import express from "express";
import { execute } from "../services/pipefy.js";
const router = express.Router();

router.post('/pipefy-proxy', async (req, res) => {
    const { action, payload } = req.body;
    try {
        const data = await execute(action, payload);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export { router };