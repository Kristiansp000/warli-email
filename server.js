require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  sendEliteEmail,
  sendOTPEmail,
  sendResetPasswordEmail,
} = require("./email_service");

const app = express();

// Konfigurasi CORS: Mengizinkan akses dari semua domain (*)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

// Route dasar
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "Warung Elite Email API",
    endpoints: [
      "POST /api/email",
      "POST /api/email/otp",
      "POST /api/email/reset-password",
    ],
  });
});

// Route kirim email
app.post("/api/email", async (req, res) => {
  try {
    const { to, subject, name, message, order_details } = req.body;

    if (!to || !subject || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "to, subject, name, dan message wajib diisi.",
      });
    }

    // Menggunakan await karena Vercel Serverless Function akan mati 
    // setelah 'res' dikirim (background process tanpa await bisa terputus)
    const result = await sendEliteEmail(
      to,
      subject,
      name,
      message,
      order_details || null
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Email berhasil dikirim.",
        messageId: result.messageId,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Hanya jalankan listener lokal jika tidak di-deploy ke Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = Number(process.env.PORT || 3030);
  app.listen(PORT, () => {
    console.log(`Warung Elite Email API berjalan di http://localhost:${PORT}`);
  });
}

// Export app agar dibaca oleh Vercel
module.exports = app;