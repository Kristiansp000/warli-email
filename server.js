require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  sendEliteEmail,
  sendOTPEmail,
  sendResetPasswordEmail,
  sendMessage,
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
      "POST /api/email/msg",
    ],
  });
});

// 1. Route kirim email pesanan/umum
app.post("/api/email", async (req, res) => {
  try {
    const { to, subject, name, message, order_details } = req.body;
    if (to && subject && name && message) {
      await sendEliteEmail(to, subject, name, message, order_details || null);
    }
  } catch (error) {
    console.error("[API /api/email] Error:", error.message);
  }
  return res.status(200).json({ success: true, message: "OK" });
});

// 2. Route kirim email OTP
app.post("/api/email/otp", async (req, res) => {
  try {
    const { to, name, otp } = req.body;
    if (to && name && otp) {
      await sendOTPEmail(to, name, otp);
    }
  } catch (error) {
    console.error("[API /api/email/otp] Error:", error.message);
  }
  return res.status(200).json({ success: true, message: "OK" });
});

// 3. Route kirim email Reset Password
app.post("/api/email/reset-password", async (req, res) => {
  try {
    // Sesuaikan parameter 'new_password' dengan payload JSON Anda
    const { to, name, new_password } = req.body; 
    if (to && name && new_password) {
      await sendResetPasswordEmail(to, name, new_password);
    }
  } catch (error) {
    console.error("[API /api/email/reset-password] Error:", error.message);
  }
  return res.status(200).json({ success: true, message: "OK" });
});

// 4. Route kirim pesan khusus (sendMessage)
app.post("/api/email/msg", async (req, res) => {
  try {
    // Asumsi parameter yang dikirim sesuai dengan standar pesan
    const { to, subject, name, message } = req.body;
    if (to && subject && name && message) {
      await sendMessage(to, subject, name, message);
    }
  } catch (error) {
    console.error("[API /api/email/msg] Error:", error.message);
  }
  return res.status(200).json({ success: true, message: "OK" });
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