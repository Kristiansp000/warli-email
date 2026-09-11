// Kirim email biasa
const response = await fetch("http://localhost:3000/api/email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "customer@example.com",
    subject: "Pesanan Berhasil",
    name: "Kristian",
    message: "Terima kasih, pesanan Anda telah diterima.",
    order_details: {
      items: [
        { name: "Nasi Ayam", qty: 2, price: 15000 },
        { name: "Es Teh", qty: 1, price: 5000 }
      ],
      total: 35000
    }
  })
});

console.log(await response.json());


// Kirim OTP
await fetch("http://localhost:3000/api/email/otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "customer@example.com",
    name: "Kristian",
    otp_code: "123456"
  })
});


// Reset password
await fetch("http://localhost:3000/api/email/reset-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "customer@example.com",
    name: "Kristian",
    new_password: "PasswordBaru123"
  })
});
