import mongoose from "mongoose";
import transporter from "../config/email.js";
import Notifications from "../models/notification.js";
import User from "../models/user.js";
import dotenv from "dotenv";
import { sendNotifications, sendNotification } from "./pushNotification.js";
dotenv.config({ path: "./config.env" });



const handlePushNotification = async({recipients, pushTitle, pushMessage, pushLink, email})=>{
     const notification = {
          title:pushTitle, message:pushMessage,  url:pushLink
      }
  switch (Number(recipients)) {
    case 1:
      try {
        const usersToNotify = await User.aggregate([
          {
            '$match': {
              'role': 0
            }
          }, {
            '$lookup': {
              'from': 'pushnotifications', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'subscriptions'
            }
          }, {
            '$unwind': {
              'path': '$subscriptions'
            }
          }, {
            '$project': {
              subscription: "$subscriptions",
            }
          }
        ])
        usersToNotify.map((user)=>sendNotification(user.subscription,notification))
      } catch (error) {
        console.log(error);
      }
      break;
    case 2:
      try {
        const usersToNotify = await User.aggregate([
          {
            '$match': {
              'role': 0
            }
          }, {
            '$lookup': {
              'from': 'subscriptions', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'subscriptions'
            }
          }, {
            '$unwind': {
              'path': '$subscriptions'
            }
          }, {
            '$match': {
              'subscriptions.status': 'active'
            }
          }, {
            '$lookup': {
              'from': 'pushnotifications', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'result'
            }
          }, {
            '$unwind': {
              'path': '$result'
            }
          }, {
            '$project': {
              'subscription': '$result'
            }
          }
        ]);
        usersToNotify.map((user)=>sendNotification(user.subscription,notification))

      } catch (error) {
        console.log(error);
      }
      break;
    case 3:
      try {
        const usersToNotify = await User.aggregate([
          {
            '$match': {
              'role': 0
            }
          }, {
            '$lookup': {
              'from': 'subscriptions', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'subscriptions'
            }
          }, {
            '$unwind': {
              'path': '$subscriptions'
            }
          }, {
            '$match': {
              'subscriptions.status': 'active', 
              'subscriptions.plan': 'premium'
            }
          }, {
            '$lookup': {
              'from': 'pushnotifications', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'result'
            }
          }, {
            '$unwind': {
              'path': '$result'
            }
          }, {
            '$project': {
              'subscription': '$result'
            }
          }
        ]);
        usersToNotify.map((user)=>sendNotification(user.subscription,notification))

      } catch (error) {
        console.log(error);
      }
      break;
    case 4:
      try {
        const usersToNotify = await User.aggregate([
          {
            '$match': {
              'role': 0
            }
          }, {
            '$lookup': {
              'from': 'subscriptions', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'subscriptions'
            }
          }, {
            '$unwind': {
              'path': '$subscriptions'
            }
          }, {
            '$match': {
              'subscriptions.status': 'active', 
              'subscriptions.plan': 'standard'
            }
          }, {
            '$lookup': {
              'from': 'pushnotifications', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'result'
            }
          }, {
            '$unwind': {
              'path': '$result'
            }
          }, {
            '$project': {
              'subscription': '$result'
            }
          }
        ]);
        usersToNotify.map((user)=>sendNotification(user.subscription,notification))

      } catch (error) {
        console.log(error);
      }
      break;
    case 5:
      try {
        const usersToNotify = await User.aggregate([
          {
            '$match': {
              'role': 0
            }
          }, {
            '$lookup': {
              'from': 'subscriptions', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'subscriptions'
            }
          }, {
            '$match': {
              '$or': [
                {
                  '$expr': {
                    '$lt': [
                      {
                        '$size': '$subscriptions'
                      }, 1
                    ]
                  }
                }, {
                  'subscriptions': {
                    '$not': {
                      '$elemMatch': {
                        'status': 'active'
                      }
                    }
                  }
                }
              ]
            }
          }, {
            '$lookup': {
              'from': 'pushnotifications', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'result'
            }
          }, {
            '$unwind': {
              'path': '$result'
            }
          }, {
            '$project': {
              'subscription': '$result'
            }
          }
        ]);
        usersToNotify.map((user)=>sendNotification(user.subscription,notification))

      } catch (error) {
        console.log(error);
      }
      break;
    case 6:
      try {
        if (!email)
          return res
            .status(400)
            .json({ message: "Please provide a valid email." });

        const usersToNotify = await User.aggregate([
          {
            '$match': {
              'email': email
            }
          }, {
            '$lookup': {
              'from': 'pushnotifications', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'result'
            }
          }, {
            '$unwind': {
              'path': '$result'
            }
          }, {
            '$project': {
              'subscription': '$result'
            }
          }
        ])
        usersToNotify.map((user)=>sendNotification(user.subscription,notification))

      } catch (error) {
        console.log(error);
      }
      break;
    case 7:
     try {
      const usersToNotify = await User.aggregate([
        {
          '$match': {
            'role': {
              '$ne': 1
            }
          }
        }, {
          '$lookup': {
            'from': 'pushnotifications', 
            'localField': '_id', 
            'foreignField': 'userId', 
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result'
          }
        }, {
          '$project': {
            'subscription': '$result'
          }
        }
      ])
      usersToNotify.map((user)=>sendNotification(user.subscription,notification))

     } catch (error) {
      console.log(error);
     }
    default:
     return
  }
}
async function notificationCreateAndMailingFunction(
  recipients,
  heading,
  message,
  newNotification,
  email
) {
  function sendEmail(to, name) {
    const mailOptions = {
      from: `"KKS Capitals" ${process.env.MAILER_MAIL}`,
      to,
      subject: "Reminder: You Have a New Notification",
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notification from KKS Capitals</title>
          <style>
              body {
                  font-family: Poppins, sans-serif;
                  line-height: 1.5;
                  color: #333;
                  background-color: #ffffff;
                  margin: 30px;
                  padding: 0;
                  background-color: inherit;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: inherit;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
              }
      
              h1 {
                  color: #096A56;
                  font-size: 26px;
                  font-weight: bold;
                  margin-top: 0;
                  margin-bottom: 20px;
              }
      
              p {
                  font-size: 12px;
                  font-weight: bold;
                  color: #555;
                  line-height: 1.6;
                  margin-bottom: 20px;
              }
      
              .cta-button {
                  display: inline-block;
                  padding: 5px 24px;
                  background-color: #096A56;
                  color: #ffffff;
                  text-decoration: none;
                  font-size: 16px;
                  font-weight: bold;
                  border-radius: 5px;
                  transition: background-color 0.3s ease;
                  margin-top: 20px;
              }
      
              .cta-button:hover {
                  background-color: #096A56;
                  color: #fff;
              }
      
              .logo-container {
                background-color:#fff;
                display:flex;
                justify-content:center;
                align-items:center;
                margin-top: 5px;
                margin-bottom: 20px;
                text-align:center;
            }
    
            .logo {
                max-width: 200px;
                background-color:#fff; 
                margin-left: auto;
                margin-right: auto;  
              }
      
              .inside-section {
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 5px;
              }

          </style>
      </head>
      
      <body>
          <div class="container">
              <div class="logo-container">
                  <img src="https://res.cloudinary.com/dy0ntl1au/image/upload/v1690431042/Static-site-nextjs/smonbay6fmjtib3ctecc.webp" class="logo"/>
              </div>
              <div class="inside-section">
                  <h1>Hi ${name},</h1>
      
                  <p class="">We hope this message finds you well. We'd like to remind you a new notification about <span style="font-size:18px">${heading}</span> in
                      your
                      KKS Dashboard. It's important to stay updated with your portfolio and make informed decisions.</p>
      
                  <p>Please log in to your KKS Capitals account to view the complete notification and take any necessary
                      actions. Your financial well-being matters to us, and we believe that this notification could be of
                      significance to your portfolio.</p>
      
                  <p>If you have any questions or need further assistance, our support team is here to help.</p>
      
                  <p>Thank you for considering KKS Capitals as your trusted investment advisor. We look forward to helping you
                      achieve your financial goals.</p>
      
                  <p>Best regards,<br>KKS Capitals<br ><a style="color:green;" href="mailto: support@kkscapitals.com"
                          target="_blank">support@kkscapitals.com</a><br>
                      <a href="tel:+91 9035808904" style="color:green">+91 9035808904</a>
                  </p>
      
                  <p style="text-align: center; color: #fff">
                      <a class="cta-button" href="https://app.kkscapitals.com/login">Login Here</a>
                  </p>
              </div>
          </div>
      </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  async function pushNotificationAndSendEmail(usersToNotify) {
    try {
      // Push the new notification to their arrays
      const notificationPromises = usersToNotify.map(async (user, index) => {
        await User.findByIdAndUpdate(user._id, {
          $push: {
            notifications: { id: newNotification._id, read: false },
          },
        });

        // Send an email notification to the user (you'll need to implement this part)
        setTimeout(() => sendEmail(user.email, user.username), 1000 * index);
      });

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error("Error pushing notification and sending email:", error);
    }
  }

  switch (Number(recipients)) {
    case 1:
      try {
        const usersToNotify = await User.find({ role: 0 });
        pushNotificationAndSendEmail(usersToNotify);
      } catch (error) {
        console.log(error);
      }
      break;
    case 2:
      try {
        const usersToNotify = await User.aggregate([
          {
            $match: {
              role: 0,
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "userId",
              as: "subscriptions",
            },
          },
          {
            $unwind: {
              path: "$subscriptions",
            },
          },
          {
            $match: {
              "subscriptions.status": "active",
            },
          },
          {
            $project: {
              email: 1,
              username: 1,
            },
          },
        ]);
        pushNotificationAndSendEmail(usersToNotify);
      } catch (error) {
        console.log(error);
      }
      break;
    case 3:
      try {
        const usersToNotify = await User.aggregate([
          {
            $match: {
              role: 0,
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "userId",
              as: "subscriptions",
            },
          },
          {
            $unwind: {
              path: "$subscriptions",
            },
          },
          {
            $match: {
              "subscriptions.status": "active",
              "subscriptions.plan": "premium",
            },
          },
          {
            $project: {
              email: 1,
              username: 1,
            },
          },
        ]);
        pushNotificationAndSendEmail(usersToNotify);
      } catch (error) {
        console.log(error);
      }
      break;
    case 4:
      try {
        const usersToNotify = await User.aggregate([
          {
            $match: {
              role: 0,
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "userId",
              as: "subscriptions",
            },
          },
          {
            $unwind: {
              path: "$subscriptions",
            },
          },
          {
            $match: {
              "subscriptions.status": "active",
              "subscriptions.plan": "standard",
            },
          },
          {
            $project: {
              email: 1,
              username: 1,
            },
          },
        ]);
        pushNotificationAndSendEmail(usersToNotify);
      } catch (error) {
        console.log(error);
      }
      break;
    case 5:
      try {
        const usersToNotify = await User.aggregate([
          {
            $match: {
              role: 0,
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "userId",
              as: "subscriptions",
            },
          },
          {
            $match: {
              $or: [
                {
                  $expr: {
                    $lt: [
                      {
                        $size: "$subscriptions",
                      },
                      1,
                    ],
                  },
                },
                {
                  subscriptions: {
                    $not: {
                      $elemMatch: {
                        status: "active",
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            $project: {
              email: 1,
              username: 1,
            },
          },
        ]);
        pushNotificationAndSendEmail(usersToNotify);
      } catch (error) {
        console.log(error);
      }
      break;
    case 6:
      try {
        if (!email)
          return res
            .status(400)
            .json({ message: "Please provide a valid email." });

        const usersToNotify = await User.findOne(
          { email },
          { email: 1, username: 1 }
        );

        if (!usersToNotify)
          return res.status(400).json({
            message: "Enter a valid email or There is no user with this email.",
          });   
        pushNotificationAndSendEmail([usersToNotify]);
      } catch (error) {
        console.log(error);
      }
      break;
    case 7:
     try {
      const usersToNotify = await User.aggregate([
        {
          '$match': {
            'role': {
              '$ne': 1
            }
          }
        },
        {
          $project: {
            email: 1,
            username: 1,
          },
        },
      ])
      pushNotificationAndSendEmail(usersToNotify);

     } catch (error) {
      console.log(error);
     }
    case 8:
      return res
        .status(400)
        .json({ message: "currently this feature is not avilable." });
    default:
      return res.status(400).json({ message: "Invalid Recipients" });
  }
}

export const addNewNotification = async (req, res) => {
  try {
    console.log(req.body);
    const { heading, message, recipients, date, email, pushNotification, pushTitle,pushMessage, pushLink } = req.body;

    if (!heading || !message || !recipients || !date) {
      return res.status(400).json({ message: "Missing data from the request." });
    }

    const newNotification = await Notifications.create(req.body);

    if (!newNotification) {
      return res.status(400).json({ message: "Error while creating a new notification." });
    }

     notificationCreateAndMailingFunction(recipients, heading, message, newNotification, email);
  
    res.status(200).json({
      message: "New notification created successfully.",
      newNotification,
    });

    if (pushNotification) {
      handlePushNotification({recipients, pushTitle, pushMessage, pushLink, email});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error: while adding a new notification.",
      error: error.message,
    });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notifications.find({}).sort({ updatedAt: -1 });
    if (!notifications)
      return res
        .status(400)
        .json({ message: "Error while fetching notifications." });

    res
      .status(200)
      .json({ message: "notification fetched successfully..", notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : while fetching all notifications.",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notifications.findByIdAndDelete(id);
    if (!deletedNotification)
      return res
        .status(400)
        .json({ message: "Error while deleting notification." });
    res.status(200).json({
      message: "successfully deleted notification",
      deletedNotification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : while deleting notification.",
      error: error.message,
    });
  }
};

export const editNotification = async (req, res) => {
  try {
    const { heading, message, recipients, date, _id: id, email } = req.body;

    if (!heading || !message || !recipients || !date || !id)
      return res
        .status(400)
        .json({ message: "Missing of datas from request." });

    const notificationWantToEdit = await Notifications.findById(id);

    const editedNotification = await Notifications.findByIdAndUpdate(
      id,
      {
        heading,
        message,
        recipients,
        date,
        email,
      },
      { new: true }
    );

    if (notificationWantToEdit.recipients !== recipients) {
      await User.updateMany(
        {
          notifications: {
            $in: [mongoose.Types.ObjectId(notificationWantToEdit._id)],
          },
        },
        { $pull: { notifications: notificationWantToEdit._id } }
      );

      notificationCreateAndMailingFunction(
        recipients,
        heading,
        message,
        editedNotification
      );
    }

    if (!editedNotification)
      return res
        .status(400)
        .json({ message: "Error occured while editing portfolio." });

    res.status(200).json({
      message: "Notification edited successfully",
      editedNotification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : while editing notification.",
      error: error.message,
    });
  }
};

export const getNewNotification = async (req, res) => {
  try {
    const { userId } = req;

    const result = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$notifications",
        },
      },
      {
        $lookup: {
          from: "notifications",
          localField: "notifications.id",
          foreignField: "_id",
          as: "notificationDetails",
        },
      },
      {
        $unwind: {
          path: "$notificationDetails",
        },
      },
      {
        $project: {
          _id: 1,
          notifications: {
            id: "$notifications.id",
            read: "$notifications.read",
            _id: "$notifications._id",
          },
          notificationDetails: {
            _id: "$notificationDetails._id",
            heading: "$notificationDetails.heading",
            message: "$notificationDetails.message",
            recipients: "$notificationDetails.recipients",
            email: "$notificationDetails.email",
            date: "$notificationDetails.date",
            createdAt: "$notificationDetails.createdAt",
            updatedAt: "$notificationDetails.updatedAt",
            read: "$notifications.read",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          notifications: {
            $push: "$notificationDetails",
          },
          notificationIds: {
            $push: "$notifications",
          },
        },
      },
      {
        $unwind: {
          path: "$notifications",
        },
      },
      {
        $sort: {
          "notifications.updatedAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          notifications: {
            $push: "$notifications",
          },
          notificationIds: {
            $first: "$notificationIds",
          },
        },
      },
      {
        $addFields: {
          notifications: {
            $concatArrays: [
              {
                $filter: {
                  input: "$notifications",
                  as: "notification",
                  cond: { $eq: ["$$notification.read", false] },
                },
              },
              {
                $filter: {
                  input: "$notifications",
                  as: "notification",
                  cond: { $eq: ["$$notification.read", true] },
                },
              },
            ],
          },
        },
      },
    ]);

    if (!result)
      return res
        .status(400)
        .json({ message: "Error while fetching user notification details." });

    if (result.length === 0)
      return res
        .status(200)
        .json({ message: "User has no new notifications.", notifications: [] });

    const { notifications, notificationIds } = result[0];

    res.status(200).json({
      message: "dashboard notifications fetched successfully..",
      notifications,
    });

    if (notificationIds)
      await User.findByIdAndUpdate(userId, { notifications: notificationIds });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : while fetching new notification.",
      error: error.message,
    });
  }
};

export const readAllNotifications = async (req, res) => {
  try {
    const { userId } = req;
    const { notifications } = await User.findByIdAndUpdate(
      userId,
      { $set: { "notifications.$[].read": true } },
      { new: true }
    );
    if (!notifications)
      return res
        .status(400)
        .json({ message: "Error while deleting all notifications" });
    res.status(200).json({
      message: "successfully deleted all notifications",
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Internal Server Error : while deleting all notifications of a user.",
      error: error.message,
    });
  }
};

export const handleSingleClose = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Missing of id from request." });

    const updatedNotification = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { notifications: { id: mongoose.Types.ObjectId(id) } },
      },
      { new: true }
    );

    if (!updatedNotification)
      return res
        .status(400)
        .json({ message: "Error while updating notification close." });
    res.status(200).json({ message: "Notification closed successfully..." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Internal Server Error : while updating a single notification close.",
      error: error.message,
    });
  }
};

export const updateSingleRead = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.body;

    if (!id)
      return res.status(400).json({ message: "Missing id from request body." });

    await User.updateOne(
      { _id: userId, "notifications.id": id },
      { $set: { "notifications.$[element].read": true } },
      {
        arrayFilters: [{ "element.id": id }],
      }
    );

    res.status(200).json({ message: "notification readed successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Internal Server Error : while updating a single notification read status.",
      error: error.message,
    });
  }
};
