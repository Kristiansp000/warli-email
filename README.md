# Warung Elite Email API - Express.js

Konversi dari `email_helper.php` menjadi REST API Express.js yang dapat dipanggil menggunakan `fetch()`.

## 1. Install

```bash
npm install
```

## 2. Konfigurasi SMTP

Salin `.env.example` menjadi `.env`, kemudian isi:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

Jangan memasukkan password SMTP langsung ke source code.

Untuk Gmail, gunakan App Password pada akun yang sudah mengaktifkan 2-Step Verification.

## 3. Jalankan

```bash
npm start
```

atau mode development:

```bash
npm run dev
```

Server default:

`http://localhost:3000`

## 4. Endpoint

### Email umum

`POST /api/email`

Body:

```json
{
  "to": "customer@example.com",
  "subject": "Pesanan Berhasil",
  "name": "Kristian",
  "message": "Terima kasih atas pesanan Anda.",
  "order_details": {
    "items": [
      {
        "name": "Nasi Ayam",
        "qty": 2,
        "price": 15000
      }
    ],
    "total": 30000
  }
}
```

### OTP

`POST /api/email/otp`

```json
{
  "to": "customer@example.com",
  "name": "Kristian",
  "otp_code": "123456"
}
```

### Reset password

`POST /api/email/reset-password`

```json
{
  "to": "customer@example.com",
  "name": "Kristian",
  "new_password": "PasswordBaru123"
}
```

## Catatan keamanan

File PHP sumber berisi kredensial SMTP secara langsung. Pada versi Express ini kredensial dipindahkan ke `.env` agar tidak ikut ter-commit atau terkirim ke frontend.

Jangan pernah mengirim `SMTP_USER` atau `SMTP_PASS` melalui `fetch()` dari browser. `fetch()` hanya memanggil endpoint Express; proses SMTP tetap berjalan di server.
