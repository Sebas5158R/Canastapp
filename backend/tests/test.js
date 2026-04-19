// test.js
import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(process.env.DATABASE_URL);
  const usuarios = await prisma.usuarios.findMany();
  console.log(usuarios);
}

main();