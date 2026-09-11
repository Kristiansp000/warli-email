require("dotenv").config();
const express = require("express");
const {
  sendEliteEmail,
  sendOTPEmail,
  sendResetPasswordEmail,
} = require("./email_service");

const app = express();
app.use(express.json({ limit: "1mb" }));

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

// Endpoint Email General / Pesanan (Non-blocking / Background Process)
app.post("/api/email", (req, res) => {
  try {
    const { to, subject, name, message, order_details } = req.body;

    if (!to || !subject || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "to, subject, name, dan message wajib diisi.",
      });
    }

    // 1. Langsung kembalikan respons ke PHP agar koneksi HTTP segera selesai
    res.status(200).json({
      success: true,
      message: "Permintaan pengiriman email diterima dan diproses di background.",
    });

    // 2. Jalankan fungsi kirim email di background (tanpa await)
    sendEliteEmail(to, subject, name, message, order_details || null).catch(
      (err) => {
        console.error("[Email Background Error]:", err.message);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Endpoint OTP
app.post("/api/email/otp", (req, res) => {
  try {
    const { to, name, otp_code } = req.body;

    if (!to || !name || !otp_code) {
      return res.status(400).json({
        success: false,
        message: "to, name, dan otp_code wajib diisi.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Permintaan pengiriman OTP diterima.",
    });

    sendOTPEmail(to, name, otp_code).catch((err) => {
      console.error("[OTP Background Error]:", err.message);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint Reset Password
app.post("/api/email/reset-password", (req, res) => {
  try {
    const { to, name, new_password } = req.body;

    if (!to || !name || !new_password) {
      return res.status(400).json({
        success: false,
        message: "to, name, dan new_password wajib diisi.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Permintaan pengiriman Reset Password diterima.",
    });

    sendResetPasswordEmail(to, name, new_password).catch((err) => {
      console.error("[Reset Password Background Error]:", err.message);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = Number(process.env.PORT || 3030);
app.listen(PORT, () => {
  console.log(`Warung Elite Email API berjalan di http://localhost:${PORT}`);
});