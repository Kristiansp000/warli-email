const nodemailer = require("nodemailer");

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} belum diatur.`);
  return value;
}

function rupiah(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: "warunggelite@gmail.com",
      pass: "eqvd hyir biqt evhz",
    },
  });
}

function buildItemsHtml(orderDetails) {
  if (!orderDetails) return "";

  const items = Array.isArray(orderDetails.items) ? orderDetails.items : [];

  let rows = items.map((item) => `
    <tr>
      <td style="padding:5px 0;">${escapeHtml(item.name)} (x${Number(item.qty) || 0})</td>
      <td style="text-align:right;">Rp ${rupiah((Number(item.price) || 0) * (Number(item.qty) || 0))}</td>
    </tr>
  `).join("");

  rows += `
    <tr>
      <td colspan="2">
        <hr style="border:0;border-top:1px solid #ddd;">
      </td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td style="text-align:right;"><strong>Rp ${rupiah(orderDetails.total)}</strong></td>
    </tr>
  `;

  return `
    <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin:15px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
      </table>
    </div>
  `;
}

function buildTemplateHtml({ name, messageContent, orderDetails }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { background-color:#f4f4f4;margin:0;padding:20px;font-family:Helvetica,Arial,sans-serif; }
    .container { max-width:500px;margin:0 auto;background:white;border-radius:16px;padding:32px;
      box-shadow:0 4px 15px rgba(0,0,0,.05);color:#333; }
    .header-text { font-size:22px;font-weight:800;color:#c5a059;text-align:center; }
    .divider { margin:20px 0;height:1px;background:#eee; }
    .footer { text-align:center;font-size:11px;color:#999;margin-top:20px; }
    p { font-size:12px;line-height:1.6; }
    td { font-size:9px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-text">Warung Elite</div>
    <div class="divider"></div>
    <p>Halo <strong>${escapeHtml(name)}</strong>,</p>
    <p>${messageContent}</p>
    ${buildItemsHtml(orderDetails)}
    <p>Salam hangat,<br><strong>Admin Warung Elite</strong></p>
  </div>
  <div class="footer">&copy; 2026 Warung Elite. IT Support @kristian.</div>
</body>
</html>`;
}

async function sendEliteEmail(toEmail, subject, name, messageContent, orderDetails = null) {
  const transporter = createTransporter();

  const html = buildTemplateHtml({
    name,
    messageContent,
    orderDetails,
  });

  try {
    const info = await transporter.sendMail({
      from: "Warung Elite",
      to: toEmail,
      subject: `Warung Elite | ${subject}`,
      html,
    });

    console.log(`[Email] Terkirim: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email] Error:", error.message);
    return { success: false, error: error.message };
  }
}


async function sendOTPEmail(toEmail, name, otpCode) {
  const message = `
    Gunakan kode berikut untuk memverifikasi akun Anda:<br><br>
    <span style="font-size:24px;font-weight:bold;color:#c5a059;">
      ${escapeHtml(otpCode)}
    </span><br><br>
    Kode ini akan kadaluarsa dalam 5 menit.
  `;

  return sendEliteEmail(toEmail, "Kode OTP Registrasi", name, message);
}


async function sendMessage(toEmail, subject, name, msg) {
  const message = `
    Pesan Baru ! <br><br>
   
      ${escapeHtml(msg)}
    <br><br>.
  `;

  return sendEliteEmail(toEmail, `Pesan Baru dari ${name}!`, name, message);
}

async function sendResetPasswordEmail(toEmail, name, newPassword) {
  const message = `
    Kami telah mengatur ulang password Anda sesuai permintaan.<br><br>
    Password baru Anda adalah:<br>
    <span style="font-size:20px;font-weight:bold;color:#c5a059;">
      ${escapeHtml(newPassword)}
    </span><br><br>
    Mohon segera ganti password Anda setelah berhasil masuk untuk keamanan.
  `;

  return sendEliteEmail(toEmail, "Reset Password Akun", name, message);
}

module.exports = {
  sendEliteEmail,
  sendOTPEmail,
  sendResetPasswordEmail,
  sendMessage,
};
