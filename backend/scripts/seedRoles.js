import prisma from "../utils/prisma.js";

const roles = [
  {
    nombre: "administrativo",
    descripcion: "Acceso a reportes, gestión de usuarios y configuraciones",
  },
  {
    nombre: "jefe_produccion",
    descripcion: "Gestión de órdenes, recetas y supervisión de producción",
  },
  {
    nombre: "auxiliar",
    descripcion: "Preparación de bodega, registro de producción y entregas",
  },
];

async function main() {
  for (const role of roles) {
    const existing = await prisma.roles.findFirst({ where: { nombre: role.nombre } });

    if (existing) {
      console.log(`Rol ya existe: ${role.nombre}`);
      continue;
    }

    await prisma.roles.create({ data: role });
    console.log(`Rol creado: ${role.nombre}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });