import { ALL_ROLES, ROLE_LABELS } from "./roles.constants.js";
import { ROLE_PERMISSIONS, getPermissionsForRole } from "./permissions.constants.js";

export const getRoles = async (req, res) => {
  const roles = ALL_ROLES.map((nombre) => ({
    nombre,
    descripcion: ROLE_LABELS[nombre] ?? null,
    permisos: getPermissionsForRole(nombre),
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