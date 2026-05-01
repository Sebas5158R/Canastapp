import prisma from "../../utils/prisma.js";

export const getUsuarios = async () => {
    return prisma.usuarios.findMany();
};

// export const createUsuario = async (data) => {
//   return prisma.usuarios.create({ data });
// };