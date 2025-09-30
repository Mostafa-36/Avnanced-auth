import nodemailer from "nodemailer";

export class EmailService {
  constructor({ host, port, secure, user, pass, service }) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: secure || false,
      service,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail({ from, to, subject, html }) {
    return this.transporter.sendMail({ from, to, subject, html });
  }
}

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mostafa",
};
