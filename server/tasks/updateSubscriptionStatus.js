import cron from "node-cron";
import dotenv from "dotenv";
import transporter from "../config/email.js";
import subscription from "../models/subscription.js";
import payment from "../models/payment.js";
import User from "../models/user.js";
dotenv.config({ path: "./config.env" });


cron.schedule("31 18 * * *", async () => {
  // Get all subscriptions that have not yet expired
  const now = new Date();
  await subscription.updateMany(
    { status: "active", endDate: { $lt: now } },
    { status: "expired" }
  );
  // Update the active and expired status of each subscription
  await subscription.updateMany(
    { status: "pending", startDate: { $lt: now } },
    { status: "active" }
  );

  // Delete Pending Payment Intent from database
  // Calculate the date 2 weeks ago
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  await payment.deleteMany({
    status: "Pending",
    createdAt: { $lt: twoWeeksAgo },
  });

  //send email notification regarding plan expiration

  const threshold = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const expiringSubscriptions = await subscription.find({
    endDate: { $lte: threshold },
    status: "active",
  });

  for (const subscriptionData of expiringSubscriptions) {
    const upcomingPlans = await subscription.find({
      userId: subscriptionData.userId,
      startDate: { $gt: threshold },
      status: "active",
    });

    if (upcomingPlans.length === 0) {
      const user = await User.findById(subscriptionData.userId);
      if (!user) {
        return;
      }
      const email = user.email;

      // Compose the email content

      // Send the email

      const mailOptions = {
        from: `"KKS Capitals" ${process.env.MAILER_MAIL}`,
        to: email,
        subject: "Subscription Expiration Notification",
        html: `<!DOCTYPE html>
  <html>
  <head>
    <title>Subscription Expiration Reminder</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Style your email using CSS */
      body {
        font-family: Arial, sans-serif;
        color: #333;
      }
      h1 {
        font-size: 28px;
        color: #666;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      li {
        margin-top:5px;
        margin-bottom:5px;
        font-size: 18px;
      }
      .highlight {
        font-weight: bold;
        color: #f44336;
      }
    </style>
  </head>
  <body>
  <h1>Subscription Expiration Reminder</h1>
  <p>Dear Subscriber,</p>
  <p>This is to notify you that your subscription will expire in ${Math.ceil(
    (subscriptionData?.endDate - now) / (1000 * 60 * 60 * 24)
  )} days.</p>
 
  <p>Please renew your subscription to continue enjoying our services.</p>
  <p>Details of your current subscription:</p>
  <ul>
    <li><strong>Plan:</strong> ${subscriptionData?.plan}</li>
    <li><strong>Amount:</strong> ${subscriptionData?.amount}</li>
    <li><strong>Started On:</strong> ${new Date(
      subscriptionData?.startDate
    ).toLocaleDateString("en-GB")}</li>
    <li><strong>Ending On:</strong> ${new Date(
      subscriptionData?.endDate
    ).toLocaleDateString("en-GB")}</li>
  </ul>

    <p>Thank you for choosing our service. If you have any questions or concerns, please feel free to contact us.</p>
    <p>Best regards,</p>
    <p>KKS Capitals</p>
  </body>
  </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  }
});
