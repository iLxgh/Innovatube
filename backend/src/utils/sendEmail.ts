import nodemailer, { type Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const hasSMTP =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

let transporter: Transporter | null = null;

if (hasSMTP) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!transporter) {
    console.warn("📧 SMTP not configured. Logging email to console.");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("Message:", options.message);
    return;
  }

  await transporter.sendMail({
    from: `${process.env.FROM_NAME || "InnovaTube"} <${process.env.FROM_EMAIL || "noreply@innovatube.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  });
};

export default sendEmail;