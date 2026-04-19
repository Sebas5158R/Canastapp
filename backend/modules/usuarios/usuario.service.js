import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const getUsuarios = async () => {
    return prisma.usuarios.findMany();
};

// export const createUsuario = async (data) => {
//   return prisma.usuarios.create({ data });
// };