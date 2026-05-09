import { hasPermission } from "../modules/usuarios/permissions.constants.js";

const getRoleName = (req) =>
  req.user?.rol?.nombre || req.user?.role || req.user?.rol || null;

export const requirePermission = (...permissions) => (req, res, next) => {
  const roleName = getRoleName(req);

  if (!roleName) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const allowed = permissions.some((permission) => hasPermission(roleName, permission));

  if (!allowed) {
    return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
  }

  return next();
};

export const requireAnyRole = (...roleNames) => (req, res, next) => {
  const roleName = getRoleName(req);

  if (!roleName) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (!roleNames.includes(roleName)) {
    return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
  }

  return next();
};