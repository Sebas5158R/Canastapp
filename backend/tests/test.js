// test.js
import prisma from "../utils/prisma.js";

async function main() {
  const usuarios = await prisma.usuarios.findMany();
  console.log(usuarios);
}

main();