import cron from 'node-cron'
import dotenv from "dotenv";
import User from '../models/user.js';
import transporter from '../config/email.js';
dotenv.config({ path: "./config.env" });


cron.schedule('42 18 * * *', async () => {

const user = (await User.find().populate('subscription')).filter((data)=>data.subscription.length === 0 && data.role === 0 )
if(user){
    user.map((user)=>{
        const daysSinceCreation = Math.floor(
            (new Date() - user.createdAt) / (1000 * 60 * 60 * 24) // Calculate the number of days since the user was created
          )
        if(daysSinceCreation && daysSinceCreation % 7 ===0){
            const mailOptions = {
                from: `"KKS Capitals" ${process.env.MAILER_MAIL}`,
                to: user.email,
                subject: 'Unlock the Benefits of Our Subscription Plans!',
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Subscription Reminder</title>
                <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
              }
              
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
              }
              
              h1 {
                font-size: 24px;
                color: #333;
                margin-top: 0;
              }
              
              p {
                margin-bottom: 20px;
              }
              
              ul {
                list-style-type: disc;
                margin-left: 20px;
                margin-bottom: 20px;
              }
              
              .cta-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4caf50;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
              }
              
              .cta-button:hover {
                background-color: #45a049;
              }
              
              /* Additional Styles for Attractiveness */
              body {
                background-color: #f7f7f7;
              }
              
              .container {
                background-color: #ffffff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
              }
              
              h1 {
                color: #333;
                font-size: 28px;
                font-weight: bold;
                margin-top: 0;
                margin-bottom: 20px;
              }
              
              p {
                font-size: 16px;
                color: #555;
                line-height: 1.6;
              }
              
              ul {
                font-size: 16px;
                color: #555;
              }
              
              .cta-button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4caf50;
                color: #ffffff;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                border-radius: 5px;
                transition: background-color 0.3s ease;
              }
              
              .cta-button:hover {
                background-color: #45a049;
              }
            </style>
                </head>
                <body>
                  <div class="container" >
                    <h1>Dear ${user.username},</h1>
                
                    <p>Don't miss out on the exclusive benefits and features that our subscription plans have to offer!</p>
                
                    <p>Unlock the following features:</p>
                
                    <ul>
                      <li>Portfolio Management</li>
                      <li>Stock List</li>
                      <li>24/7 Support</li>
                      <li>Advanced SIPs</li>
                    </ul>
                
                    <p>Our subscription plans start from just ₹328.6 per month. Subscribing to a plan will provide you with valuable insights and guidance to navigate the stock market and make informed investment decisions.</p>
                                
                    <p>If you have any questions or need further assistance, our support team is here to help.</p>
                
                    <p>Thank you for considering KKS Capitals as your trusted investment advisor. We look forward to helping you achieve your financial goals.</p>
                
                    <p>Best regards,<br>KKS Capitals<br>support@kkscapitals.com.com <br> +91 9035808904</p>
                
                    <p style="text-align: center;">
                      <a class="cta-button" href="https://app.kkscapitals.com/user/subscription-details">Subscribe Now</a>
                    </p>
                  </div>
                </body>
                </html>
            
                `,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            })
        }
    })
}
});


cron.schedule('52 18 * * *', async () => {

const users = (await User.find().populate('loginHistory').populate({ path: 'subscription',  match: { status: 'active' },
  })).filter((data)=> data.role === 0 && data.subscription[0] && data.loginHistory[0])
users.map((user)=>{
    const lastLogin = user.loginHistory[0].loginHistory[user.loginHistory[0].loginHistory.length-1].timestamp
    const daysSinceLogin = Math.floor(
        (new Date() - lastLogin) / (1000 * 60 * 60 * 24) // Calculate the number of days since the user was created
      )
    if(daysSinceLogin && daysSinceLogin % 7 === 0){
        const mailOptions = {
            from:  `"KKS Capitals" ${process.env.MAILER_MAIL}`,
            to: user.email,
            subject: 'We Miss You! Come Back and Explore Our Latest Updates',
            html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>We Miss You!</title>
                    <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #333;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              border-radius: 5px;
            }
            
            h1 {
              font-size: 24px;
              color: #333;
              margin-top: 0;
            }
            
            p {
              margin-bottom: 20px;
            }
            

            .cta-button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4caf50;
              color: #ffffff;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              border-radius: 5px;
              transition: background-color 0.3s ease;
            }
            
            .cta-button:hover {
              background-color: #45a049;
            }
          </style>
              </head>
              <body>
                <div class="container">
                  <h1>Dear ${user.username},</h1>
                  <p>We hope this email finds you well. We noticed that you haven't logged in to your account for a week.</p>
                  <p>We wanted to remind you of the latest updates and improvements we've made to our platform.</p>
                 
                  <p>Stay updated with the latest market trends. Log in to your account now and explore all that we have to offer.</p>
                  <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                  <p>We value your partnership and look forward to serving you.</p>
                  <p>Best regards,<br>KKS Capitals<br>support@kks.com <br> +91 9035808904</p>        
                  <p style="text-align: center;">
                  <a class="cta-button" href="https://app.kkscapitals.com/login">Login Now</a>
                </p>
                  </div>
              </body>
            </html>
            `,
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
    }
})

})
