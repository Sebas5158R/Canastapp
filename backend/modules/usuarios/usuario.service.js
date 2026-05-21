import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import prisma from "../../utils/prisma.js";
import { toSafeUser } from "../auth/auth.service.js";
import { sendCredentialsEmail } from "../../utils/mailer.js";

const createHttpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const normalizeText = (value) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.|\.$/g, "")
        .replace(/\.+/g, ".");

const getEmailDomain = () =>
    String(process.env.EMAIL_DOMAIN || process.env.APP_EMAIL_DOMAIN || "canastapp.local").trim().toLowerCase();

const generateTemporaryPassword = (length = 12) =>
    crypto.randomBytes(length)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, length);

const buildEmailCandidate = (nombreCompleto, suffix = 0) => {
    const cleanName = normalizeText(nombreCompleto);
    if (!cleanName) {
        return "";
    }

    const parts = cleanName.split(".").filter(Boolean);
    const first = parts[0] || cleanName;
    const last = parts[parts.length - 1] || cleanName;
    const localPartBase = `${first}.${last}`;
    const localPart = suffix > 0 ? `${localPartBase}${suffix}` : localPartBase;

    return `${localPart}@${getEmailDomain()}`;
};

const generateUniqueEmail = async (nombreCompleto) => {
    for (let suffix = 0; suffix < 50; suffix += 1) {
        const correo = buildEmailCandidate(nombreCompleto, suffix);

        if (!correo) {
            break;
        }

        const existing = await prisma.usuarios.findFirst({
            where: {
                correo: {
                    equals: correo,
                    mode: "insensitive",
                },
            },
        });

        if (!existing) {
            return correo;
        }
    }

    throw createHttpError(409, "No fue posible generar un correo único para el usuario");
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const resolveRole = async (rolIdOrNombre) => {
    const rawRole = String(rolIdOrNombre || "").trim();

    if (!rawRole) {
        throw createHttpError(400, "El rol es obligatorio");
    }

    if (/^\d+$/.test(rawRole)) {
        const rol = await prisma.roles.findUnique({
            where: { id: BigInt(rawRole) },
        });

        if (rol) {
            return rol;
        }
    }

    const rolPorNombre = await prisma.roles.findFirst({
        where: {
            nombre: {
                equals: rawRole,
                mode: "insensitive",
            },
        },
    });

    if (rolPorNombre) {
        return rolPorNombre;
    }

    throw createHttpError(404, "El rol seleccionado no existe");
};

export const getUsuarios = async () => {
    const usuarios = await prisma.usuarios.findMany({
        include: { roles: true },
        orderBy: { fecha_creacion: "desc" },
    });

    return usuarios.map((usuario) => toSafeUser(usuario));
};

export const createUsuario = async (data) => {
    const nombreCompleto = String(data?.nombre_completo || "").trim();
    const numeroIdentificacion = String(data?.numero_identificacion || "").trim() || null;
    const correoSolicitado = normalizeEmail(data?.correo);
    const rol = await resolveRole(data?.rol_id);

    if (!nombreCompleto) {
        throw createHttpError(400, "El nombre completo es obligatorio");
    }

    if (numeroIdentificacion) {
        const usuarioExistente = await prisma.usuarios.findFirst({
            where: { numero_identificacion: numeroIdentificacion },
        });

        if (usuarioExistente) {
            throw createHttpError(409, "Ya existe un usuario con ese número de identificación");
        }
    }

    const correo = correoSolicitado || await generateUniqueEmail(nombreCompleto);
    const correoExistente = await prisma.usuarios.findFirst({
        where: {
            correo: {
                equals: correo,
                mode: "insensitive",
            },
        },
    });

    if (correoExistente) {
        throw createHttpError(409, "Ya existe un usuario con ese correo");
    }

    const contrasenaTemporal = generateTemporaryPassword();
    const contrasenaHash = await bcrypt.hash(contrasenaTemporal, 10);

    const usuarioCreado = await prisma.usuarios.create({
        data: {
            nombre_completo: nombreCompleto,
            numero_identificacion: numeroIdentificacion,
            correo,
            contrasena_hash: contrasenaHash,
            rol_id: rol.id,
            activo: true,
        },
        include: { roles: true },
    });

    try {
        await sendCredentialsEmail({
            to: correo,
            nombreCompleto,
            correo,
            contrasena: contrasenaTemporal,
            rolNombre: rol.nombre,
        });
    } catch (error) {
        await prisma.usuarios.delete({ where: { id: usuarioCreado.id } });
        console.error("Error enviando credenciales al correo:", error);
        throw createHttpError(502, "No se pudo enviar el correo con las credenciales del usuario");
    }

    return {
        message: "Usuario creado correctamente. Se envió un correo con sus credenciales.",
        usuario: toSafeUser(usuarioCreado),
        correo_generado: correo,
    };
};

// Función para actualizar un usuario existente
export const updateUsuario = async (id, data) => {
    const usuarioId = BigInt(id);

    const usuarioExistente = await prisma.usuarios.findUnique({
        where: { id: usuarioId },
        include: { roles: true },
    });

    if (!usuarioExistente) {
        throw createHttpError(404, "Usuario no encontrado");
    }

    const nombreCompleto = String(data?.nombre_completo || "").trim();
    const numeroIdentificacion =
        String(data?.numero_identificacion || "").trim() || null;
    const correo = normalizeEmail(data?.correo);

    if (!nombreCompleto) {
        throw createHttpError(400, "El nombre completo es obligatorio");
    }

    if (!correo) {
        throw createHttpError(400, "El correo es obligatorio");
    }

    // Validar rol
    const rol = await resolveRole(data?.rol_id);

    // Validar correo único
    const correoExistente = await prisma.usuarios.findFirst({
        where: {
            correo: {
                equals: correo,
                mode: "insensitive",
            },
            NOT: {
                id: usuarioId,
            },
        },
    });

    if (correoExistente) {
        throw createHttpError(409, "Ya existe un usuario con ese correo");
    }

    // Validar identificación única
    if (numeroIdentificacion) {
        const identificacionExistente = await prisma.usuarios.findFirst({
            where: {
                numero_identificacion: numeroIdentificacion,
                NOT: {
                    id: usuarioId,
                },
            },
        });

        if (identificacionExistente) {
            throw createHttpError(
                409,
                "Ya existe un usuario con ese número de identificación"
            );
        }
    }

    const usuarioActualizado = await prisma.usuarios.update({
        where: { id: usuarioId },
        data: {
            nombre_completo: nombreCompleto,
            numero_identificacion: numeroIdentificacion,
            correo,
            rol_id: rol.id,
            activo:
                typeof data?.activo === "boolean"
                    ? data.activo
                    : usuarioExistente.activo,
        },
        include: { roles: true },
    });

    return {
        message: "Usuario actualizado correctamente",
        usuario: toSafeUser(usuarioActualizado),
    };
};

// Función para eliminar un usuario
export const deleteUsuario = async (id) => {
    const usuarioId = BigInt(id);
    const usuarioExistente = await prisma.usuarios.findUnique({
        where: { id: usuarioId },
    });

    if (!usuarioExistente) {
        throw createHttpError(404, "Usuario no encontrado");
    }

    await prisma.usuarios.delete({
        where: { id: usuarioId },
    });

    return {
        message: "Usuario eliminado correctamente",
    };
};
