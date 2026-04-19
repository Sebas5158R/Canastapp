import "dotenv/config";
import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/index.js";

const app = express();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.json());

app.get("/", async (req, res) => {
    res.json("Funcionando")
})

app.listen(3000, () => {
    console.log("Servidor backend corriendo en http://localhost:3000")
})