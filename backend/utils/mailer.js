import nodemailer from "nodemailer";

const getTransportConfig = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 0);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
        throw new Error("Faltan variables SMTP_HOST, SMTP_PORT, SMTP_USER o SMTP_PASS para enviar correos");
    }

    return {
        host,
        port,
        secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
        auth: {
            user,
            pass,
        },
    };
};

const getFromAddress = () =>
    process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@canastapp.local";

export const sendCredentialsEmail = async ({ to, nombreCompleto, correo, contrasena, rolNombre }) => {
    const transporter = nodemailer.createTransport(getTransportConfig());

    await transporter.sendMail({
        from: getFromAddress(),
        to,
        subject: "Tus credenciales de acceso a Canastapp",
        text: [
            `Hola ${nombreCompleto},`,
            "",
            "Tu usuario en Canastapp fue creado correctamente.",
            `Correo: ${correo}`,
            `Contraseña temporal: ${contrasena}`,
            rolNombre ? `Rol asignado: ${rolNombre}` : null,
            "",
            "Ingresa al sistema y cambia tu contraseña al primer acceso.",
        ]
            .filter(Boolean)
            .join("\n"),
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                <h2 style="margin-bottom: 16px;">Tus credenciales de acceso a Canastapp</h2>
                <p>Hola <strong>${nombreCompleto}</strong>,</p>
                <p>Tu usuario fue creado correctamente.</p>
                <ul>
                    <li><strong>Correo:</strong> ${correo}</li>
                    <li><strong>Contraseña temporal:</strong> ${contrasena}</li>
                    ${rolNombre ? `<li><strong>Rol asignado:</strong> ${rolNombre}</li>` : ""}
                </ul>
                <p>Ingresa al sistema y cambia tu contraseña al primer acceso.</p>
            </div>
        `,
    });
};