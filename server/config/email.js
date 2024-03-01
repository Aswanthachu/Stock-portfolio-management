import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

// const transporter = nodemailer.createTransport({
//     host: 'smtp.zoho.in',
//     port: 465, // Use port 587 for TLS
//     secure: true, // true for 465, false for other ports
//     // port: 587, // Use port 587 for TLS
//     // secure: false, // true for 465, false for other ports
//     auth: {
//       user: `${process.env.MAILER_MAIL}`,
//       pass: `${process.env.MAILER_PASS}`,
//     },
//     tls: {
//       // ciphers: 'SSLv3',
//       rejectUnauthorized: false,
//     },
//   });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_MAIL,
      pass: process.env.MAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

 export default transporter;