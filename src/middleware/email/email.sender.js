
import nodemailer from "nodemailer"


export const senderMail = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "patil.bhushan6898@gmail.com",
      pass: "lqsm soqp dfks pgfn",
    },
  });
  