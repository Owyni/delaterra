import { Resend } from "resend";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error(
      "Configuración de correo incompleta: define RESEND_API_KEY y RESEND_FROM_EMAIL.",
    );
  }

  return {
    resend: new Resend(apiKey),
    from,
  };
}

export async function sendVerificationEmail(params: {
  to: string;
  name: string;
  url: string;
}): Promise<void> {
  const { resend, from } = getResendConfig();
  const safeName = escapeHtml(params.name || "productor o comprador");
  const safeUrl = escapeHtml(params.url);

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Verifica tu correo electrónico en Delaterra",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #183b2b; background: #f6f5ed; padding: 32px; border-radius: 16px;">
        <h1 style="font-size: 22px; margin: 0 0 12px;">Bienvenido a Delaterra</h1>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Hola <strong>${safeName}</strong>, gracias por registrarte en la red agrícola de Michoacán.
          Para activar tu cuenta y poder iniciar sesión, confirma tu correo electrónico dando clic en el siguiente botón:
        </p>
        <p style="margin: 24px 0;">
          <a href="${safeUrl}" style="display: inline-block; background: #244d36; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 999px;">
            Verificar mi correo
          </a>
        </p>
        <p style="font-size: 13px; color: #5c6b5c; line-height: 1.5; margin: 0 0 10px;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>
        <p style="font-size: 12px; color: #244d36; word-break: break-all; margin: 0 0 20px;">
          ${safeUrl}
        </p>
        <p style="font-size: 12px; color: #7b8677; margin: 0;">
          Este enlace expira en 1 hora. Si no solicitaste esta cuenta, puedes ignorar este mensaje.
        </p>
      </div>
    `,
    text: `Hola ${params.name || ""}, confirma tu correo electrónico en Delaterra abriendo este enlace: ${params.url}`,
  });

  if (error) {
    throw new Error(`No se pudo enviar el correo de verificación: ${error.message}`);
  }
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  url: string;
}): Promise<void> {
  const { resend, from } = getResendConfig();
  const safeName = escapeHtml(params.name || "usuario");
  const safeUrl = escapeHtml(params.url);

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Restablece tu contraseña en Delaterra",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #183b2b; background: #f6f5ed; padding: 32px; border-radius: 16px;">
        <h1 style="font-size: 22px; margin: 0 0 12px;">Recuperación de contraseña</h1>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Hola <strong>${safeName}</strong>, recibimos una solicitud para cambiar tu contraseña en Delaterra.
          Usa el siguiente botón para elegir una nueva contraseña:
        </p>
        <p style="margin: 24px 0;">
          <a href="${safeUrl}" style="display: inline-block; background: #244d36; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 999px;">
            Restablecer contraseña
          </a>
        </p>
        <p style="font-size: 13px; color: #5c6b5c; line-height: 1.5; margin: 0 0 10px;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>
        <p style="font-size: 12px; color: #244d36; word-break: break-all; margin: 0 0 20px;">
          ${safeUrl}
        </p>
        <p style="font-size: 12px; color: #7b8677; margin: 0;">
          Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.
        </p>
      </div>
    `,
    text: `Hola ${params.name || ""}, restablece tu contraseña en Delaterra abriendo este enlace: ${params.url}`,
  });

  if (error) {
    throw new Error(`No se pudo enviar el correo de recuperación: ${error.message}`);
  }
}
