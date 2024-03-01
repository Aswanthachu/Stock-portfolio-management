import transporter from "../config/email.js";

export function sendEmail(from,to,subject,html,text) {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }