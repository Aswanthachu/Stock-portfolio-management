import transporter from "../config/email.js";

export const sendTicketAssignedNotificationMail = async (data) => {
    const mailOptions = {
      from: `"KKS Capitals" ${process.env.MAILER_MAIL}`,
      to: data.email,
      subject: 'New Ticket Assigned',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Ticket Assigned Notification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #096A56;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
              }
              .header {
                  background-color: #096a56;
                  color: #fff;
                  text-align: center;
                  padding: 10px;
              }
              .content {
                  padding: 20px;
              }
              .ticket-details {
                  border: 1px solid #ddd;
                  padding: 10px;
                  margin-bottom: 20px;
              }
              .button {
                  text-align: center;
                  margin-top: 20px;
              }
              .button a {
                  display: inline-block;
                  background-color: #096a56;
                  color: #fff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>New Ticket Assigned Notification</h1>
              </div>
              <div class="content">
                  <p>Hello ${data.username},</p>
                  <p>A new ticket has been assigned to you for assistance.</p>
                  <div class="ticket-details">
                      <h2>Ticket Details</h2>
                      <p><strong>Subject:</strong>${data.subject}</p>
                      <p><strong>Category:</strong> ${data.category}</p>
                      <p><strong>Description:</strong> ${data.description}</p>
                  </div>
                  <p>Please review the ticket and provide assistance to the user as soon as possible.</p>
                  <div class="button">
                      <a href="https://app.kkscapitals.com/sub-admin/tickets" target="_blank">Manage Ticket</a>
                  </div>
              </div>
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


export const sendTicketReAssignedNotificationMail = async (data) => {
    const mailOptions = {
      from: `"KKS Capitals" ${process.env.MAILER_MAIL}`,
      to: data.email,
      subject: 'New Ticket Assigned',
      html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Reassignment Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #096A56;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            background-color: #096a56;
            color: #fff;
            text-align: center;
            padding: 10px;
        }
        .content {
            padding: 20px;
        }
        .ticket-details {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 20px;
        }
        .button {
            text-align: center;
            margin-top: 20px;
        }
        .button a {
            display: inline-block;
            background-color: #096a56;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket Reassignment Notification from KKS Capitals</h1>
        </div>
        <div class="content">
            <p>Hello ${data.username},</p>
            <p>A ticket has been reassigned to you by the admin at KKS Capitals for further assistance.</p>
            <div class="ticket-details">
                <h2>Ticket Details</h2>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Category:</strong> ${data.category}</p>
            </div>
            <p>Please review the ticket and take necessary actions promptly.</p>
            <div class="button">
                <a href="https://app.kkscapitals.com/sub-admin/tickets" target="_blank">Manage Ticket</a>
            </div>
        </div>
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

  export const sendNewMessageNotificationMail = async(data)=>{
    const mailOptions = {
        from: `"KKS Capitals" ${process.env.MAILER_MAIL}`,
        to: data.email,
        subject: 'New Message Received',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Message Received</title>
            <style>
            /* Add your custom CSS styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .title {
                color: #096a56;
            }
            .header {
              background-color: #096a56;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
            }
            .ticket-details {
                border: 1px solid #ddd;
                padding: 10px;
                margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message Received</h1>
            </div>
            <div class="content">
              <p>Dear ${data?.username},</p>
              <p>You have received a new message from ${data.senderName}:</p>
              <div class="ticket-details">
              <h2 class='title' >Ticket Details</h2>
              <p><strong>Subject:</strong>${data.subject}</p>
              <p><strong>Category:</strong> ${data.category}</p>
          </div>
              <p>You can log in to your account to view and respond to the message.</p>
              <p>Thank you for using our platform.</p>
              <p>Sincerely,<br>-KKS Capitals</p>
            </div>
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