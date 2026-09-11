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

app.post("/api/email", async (req, res) => {
  try {
    const { to, subject, name, message, order_details } = req.body;

    if (!to || !subject || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "to, subject, name, dan message wajib diisi.",
      });
    }

    const result = await sendEliteEmail(
      to,
      subject,
      name,
      message,
      order_details || null
    );

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/email/otp", async (req, res) => {
  try {
    const { to, name, otp_code } = req.body;

    if (!to || !name || !otp_code) {
      return res.status(400).json({
        success: false,
        message: "to, name, dan otp_code wajib diisi.",
      });
    }

    const result = await sendOTPEmail(to, name, otp_code);

    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/email/reset-password", async (req, res) => {
  try {
    const { to, name, new_password } = req.body;

    if (!to || !name || !new_password) {
      return res.status(400).json({
        success: false,
        message: "to, name, dan new_password wajib diisi.",
      });
    }

    const result = await sendResetPasswordEmail(
      to,
      name,
      new_password
    );

    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Warung Elite Email API berjalan di http://localhost:${PORT}`);
});
