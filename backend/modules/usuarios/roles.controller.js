import prisma from "../../utils/prisma.js";
import { ALL_ROLES, ROLE_LABELS } from "./roles.constants.js";
import { ROLE_PERMISSIONS, getPermissionsForRole } from "./permissions.constants.js";

export const getRoles = async (req, res) => {
  const rolesDesdeDB = await prisma.roles.findMany({
    orderBy: { nombre: "asc" },
  });

  const roles = rolesDesdeDB.map((rol) => ({
    id: String(rol.id),
    nombre: rol.nombre,
    descripcion: rol.descripcion ?? ROLE_LABELS[rol.nombre] ?? null,
    permisos: getPermissionsForRole(rol.nombre),
  }));

  res.json(roles);
};

export const getRolePermissions = async (req, res) => {
  const { nombre } = req.params;

  if (!ALL_ROLES.includes(nombre)) {
    return res.status(404).json({ message: "Rol no encontrado" });
  }

  res.json({
    nombre,
    permisos: ROLE_PERMISSIONS[nombre] ?? [],
  });
};