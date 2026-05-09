import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma.js";
import { getPermissionsForRole } from "../usuarios/permissions.constants.js";

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseBigIntId = (value, fieldName = "id") => {
  if (typeof value === "bigint") {
    return value;
  }

  try {
    return BigInt(value);
  } catch {
    throw createHttpError(400, `${fieldName} inválido`);
  }
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export const toSafeUser = (usuario) => {
  const roleName = usuario.roles?.nombre || null;

  return {
    id: String(usuario.id),
    nombre_completo: usuario.nombre_completo,
    numero_identificacion: usuario.numero_identificacion,
    correo: usuario.correo,
    activo: usuario.activo,
    fecha_creacion: usuario.fecha_creacion,
    ultimo_acceso: usuario.ultimo_acceso,
    rol: usuario.roles
      ? {
          id: String(usuario.roles.id),
          nombre: usuario.roles.nombre,
          descripcion: usuario.roles.descripcion,
          permisos: getPermissionsForRole(roleName),
        }
      : null,
  };
};

const verifyPassword = async (plainPassword, storedHash) => {
  if (!storedHash) {
    return false;
  }

  if (String(storedHash).startsWith("$2")) {
    return bcrypt.compare(plainPassword, storedHash);
  }

  return plainPassword === storedHash;
};

export const login = async ({ correo, contrasena }) => {
  const normalizedCorreo = normalizeEmail(correo);

  if (!normalizedCorreo || !contrasena) {
    throw createHttpError(400, "correo y contrasena son requeridos");
  }

  const usuario = await prisma.usuarios.findFirst({
    where: {
      correo: {
        equals: normalizedCorreo,
        mode: "insensitive",
      },
    },
    include: { roles: true },
  });

  if (!usuario) {
    throw createHttpError(401, "Credenciales inválidas");
  }

  if (usuario.activo === false) {
    throw createHttpError(403, "Usuario inactivo");
  }

  const passwordOk = await verifyPassword(contrasena, usuario.contrasena_hash);

  if (!passwordOk) {
    throw createHttpError(401, "Credenciales inválidas");
  }

  const roleName = usuario.roles?.nombre || null;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw createHttpError(500, "JWT_SECRET no está configurado");
  }

  const tokenPayload = {
    sub: String(usuario.id),
    user: toSafeUser(usuario),
    rol: roleName ? { nombre: roleName } : null,
  };

  const token = jwt.sign(tokenPayload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });

  await prisma.usuarios.update({
    where: { id: usuario.id },
    data: { ultimo_acceso: new Date() },
  });

  return {
    token,
    token_type: "Bearer",
    expires_in: process.env.JWT_EXPIRES_IN || "8h",
    user: toSafeUser(usuario),
  };
};

export const getCurrentUser = async (userId) => {
  const usuarioId = parseBigIntId(userId, "user_id");

  const usuario = await prisma.usuarios.findUnique({
    where: { id: usuarioId },
    include: { roles: true },
  });

  if (!usuario) {
    throw createHttpError(404, "Usuario no encontrado");
  }

  return toSafeUser(usuario);
};