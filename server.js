require("dotenv").config(); //[cite: 4]
const express = require("express"); //[cite: 4]
const cors = require("cors"); // 1. Import modul cors
const {
  sendEliteEmail,
  sendOTPEmail,
  sendResetPasswordEmail,
} = require("./email_service"); //[cite: 4]

const app = express(); //[cite: 4]

// 2. Konfigurasi CORS
// Opsional A: Izinkan semua domain (Cocok untuk lokal/development)
app.use(cors());

/* 
// Opsional B: Batasi hanya domain tertentu saja (Rekomendasi Production)
const allowedOrigins = ['http://domain-php-kamu.com', 'http://localhost:8000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Akses ditolak oleh kebijakan CORS.'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
*/

app.use(express.json({ limit: "1mb" })); //[cite: 4]

// --- Sisa routing tetap sama seperti sebelumnya ---[cite: 4]
app.get("/", (req, res) => { //[cite: 4]
  res.json({ //[cite: 4]
    success: true, //[cite: 4]
    service: "Warung Elite Email API", //[cite: 4]
    endpoints: [ //[cite: 4]
      "POST /api/email", //[cite: 4]
      "POST /api/email/otp", //[cite: 4]
      "POST /api/email/reset-password", //[cite: 4]
    ], //[cite: 4]
  }); //[cite: 4]
}); //[cite: 4]

app.post("/api/email", (req, res) => { //[cite: 4]
  try { //[cite: 4]
    const { to, subject, name, message, order_details } = req.body; //[cite: 4]

    if (!to || !subject || !name || !message) { //[cite: 4]
      return res.status(400).json({ //[cite: 4]
        success: false, //[cite: 4]
        message: "to, subject, name, dan message wajib diisi.", //[cite: 4]
      }); //[cite: 4]
    } //[cite: 4]

    res.status(200).json({ //[cite: 4]
      success: true, //[cite: 4]
      message: "Permintaan pengiriman email diterima dan diproses di background.", //[cite: 4]
    }); //[cite: 4]

    sendEliteEmail(to, subject, name, message, order_details || null).catch( //[cite: 4]
      (err) => { //[cite: 4]
        console.error("[Email Background Error]:", err.message); //[cite: 4]
      } //[cite: 4]
    ); //[cite: 4]
  } catch (error) { //[cite: 4]
    console.error(error); //[cite: 4]
    res.status(500).json({ //[cite: 4]
      success: false, //[cite: 4]
      message: error.message, //[cite: 4]
    }); //[cite: 4]
  } //[cite: 4]
}); //[cite: 4]

const PORT = Number(process.env.PORT || 3030); //[cite: 4]
app.listen(PORT, () => { //[cite: 4]
  console.log(`Warung Elite Email API berjalan di http://localhost:${PORT}`); //[cite: 4]
}); //[cite: 4]