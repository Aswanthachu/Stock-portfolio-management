import ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import transporter from "../../config/email.js";
import cloudinary from "../../lib/cloudinary.js";
import { io } from "../../index.js";
import { Types } from "mongoose";
import {getActiveUsers, emitDataToUser } from './ticketEvents.js'
import { sendTicketAssignedNotificationMail ,sendNewMessageNotificationMail, sendTicketReAssignedNotificationMail } from "../../emails/index.js";
import { sendNotifications } from "../pushNotification.js";


export const getTickets = async (req, res) => {
  const { userId } = req;
  try {
    const { role } = await User.findById(userId);

    if (typeof role !== "number") {
      return res
        .status(400)
        .json({ message: "Error while fetching type of logined user." });
    }

    // getting tickets by role of user

    let macthStage = {};
    let condition = {};
    let readType = {};

    // By using switch operator differenciating users conditions for querying into tickets schema

    switch (role) {
      case 1:

        condition = { $eq: ["$$reply.adminUnread", true] };
        readType = { adminUnread: "$adminUnread" };
        break;
      case 2:
        macthStage = { assignedTo: Types.ObjectId(userId) };
        condition = { $eq: ["$$reply.adminUnread", true] };
        readType = { adminUnread: "$adminUnread" };
        break;
      case 3:
        macthStage = { assignedTo: Types.ObjectId(userId) };
        condition = { $eq: ["$$reply.adminUnread", true] };
        readType = { adminUnread: "$adminUnread" };
        break;
      case 0:
        macthStage = { userId: Types.ObjectId(userId) };
        condition = { $eq: ["$$reply.userUnread", true] };
        readType = { userUnread: "$userUnread" };
        break;
    }

    // fetching tickets from tickets schema using mongodb aggregation pipeline.

    const tickets = await ticket.aggregate([
      { $match: macthStage },
      {
        $project: {
          numberOfReplies: {
            $size: "$replies",
          },
          ticketId: 1,
          subject: 1,
          date: 1,
          status: 1,
          paymentStatus: 1,
          adminUnread: "$replies.adminUnread",
          userUnread: "$replies.userUnread",
          category: 1,
          assignedTo:1,
          assignedUsername:1,
          
          count: {
            $size: {
              $filter: {
                input: "$replies",
                as: "reply",
                cond: condition,
              },
            },
          },
        },
      },
      {
        $sort: {
          ticketId: -1,
        },
      },
    ]);

    if (!tickets) {
      return res.status(400).json({
        message: "Error occured while fetching tickets from database.",
      });
    } else if (!tickets?.length) {
      res.status(401).json({ message: "Not tickets for the user" });
    } else {
      res.status(200).json(tickets);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Tickets fetching failed due to Internal Server error.",
      error: error.message,
    });
  }
};

export const getSingleTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    if (!ticketId)
      return res.status(400).json({
        message: "Not a valid ticketId or error while fetching ticketId.",
      });

    // getting single ticket details using ticketId and send to user as response.

    const ticketData = await ticket.findOne({ ticketId });

    if (!ticketData)
      return res
        .status(400)
        .json({ message: "Error while fetching ticketData from database." });
    res
      .status(200)
      .json({ ticketData, message: "successfully retrived ticket" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error occured while fetching single ticket.",
      error: error.message,
    });
  }
};

export const addNewTicket = async (req, res) => {
  const { userId } = req;
  const { category, subject, description, cloudResData, file, paymentStatus } =
    req.body;

  try {
    if (!category || !subject || !description)
      return res.status(400).json({ message: "missing datas." });
    const { username, role } = await User.findById(userId);

    if (!username || typeof role !== "number")
      return res
        .status(400)
        .json({ message: "Error while fetching user details" });

    // function for creating reply schema/object in ticket schema,If file is a pdf,cloudinary uploaded link is provided from
    // frontend, If it is image first upload file to cloudinary then store its url to reply schema.Text messages are directly added to message field in reply schema.

    const generateReplies = async (
      userId,
      username,
      description,
      role,
      cloudResData,
      file,
      assignedSubadmin,
      subAdminRole
    ) => {
      const baseReply = {
        userId,
        username,
        role,
        message: description,
        date: new Date().toLocaleDateString(),
        adminUnread: true,
      };
      const predefinedMessage = {
        userId: assignedSubadmin?._id,
        username: assignedSubadmin?.username,
        role: subAdminRole,
        message: `
        Your support ticket has been assigned to Mr./Ms. ${assignedSubadmin?.username} . They will assist you shortly.
      
        - KKS Capitals
        `,
        date: new Date().toLocaleDateString(),
        userUnread: true,

      }

      if (cloudResData) {
        return [
          {
            ...baseReply,
            url: cloudResData,
            fileFormat: "pdf",
          },
          predefinedMessage
        ];
      } else if (file) {
        const { secure_url, format } = await cloudinary.uploader.upload(file, {
          folder: "TicketsData",
          upload_preset: "TicketsMessages",
        });

        if (!secure_url || !format)
          return res
            .status(400)
            .json({ message: "Error while uploading contents to cloudinary." });

        return [
          {
            ...baseReply,
            url: secure_url,
            fileFormat: format,
          },
          predefinedMessage
        ];
      } else {
        return [baseReply,predefinedMessage];
      }
    };


    const findSubadmin = async (role) => {
      const subadmins = await User.aggregate([
        {
          '$match': {
            'role': role
          }
        }, {
          '$lookup': {
            'from': 'tickets',
            'localField': '_id',
            'foreignField': 'assignedTo',
            'as': 'tickets'
          }
        }, {
          '$addFields': {
            'ticketsLastWeek': {
              '$filter': {
                'input': '$tickets',
                'as': 'ticket',
                'cond': {
                  '$gte': [
                    '$$ticket.createdAt', {
                      '$subtract': [
                        new Date(), 604800000
                      ]
                    }
                  ]
                }
              }
            }
          }
        }, {
          '$addFields': {
            'count': {
              '$size': '$ticketsLastWeek'
            }
          }
        }, {
          '$project': {
            'count': 1,
            'username': 1,
            'email': 1,
          }
        }, {
          '$sort': {
            'count': 1
          }
        }
      ])
      const activeUsers = getActiveUsers()

      const activeSubadmin = subadmins.find(subadmin => {
        return activeUsers?.some(activeUser => activeUser.userId === subadmin._id);
      });

      if (activeSubadmin) {
        return activeSubadmin
      } else {
        const data = {
          email: subadmins[0].email,
          username: subadmins[0].username,
          subject,
          category,
          description,
        }
        sendTicketAssignedNotificationMail(data)
        return subadmins[0]
      }
      
    }


    let assignedSubadmin;
    let subAdminRole
    if (category === 'Financial') {
      subAdminRole=2
    } else if (category === 'Technical') {
      subAdminRole=3
    }
    assignedSubadmin = await findSubadmin(subAdminRole)

    // creating ticket in tickets collection using userdetails and replies object generated by generateReplies function.
    const replies = await generateReplies(
      userId,
      username,
      description,
      role,
      cloudResData,
      file,
      assignedSubadmin,
      subAdminRole
    );
    const { ticketId, date, status, userUnread, _id ,adminUnread,assignedTo,assignedUsername} = await ticket.create({
      userId,
      category,
      subject,
      paymentStatus,
      replies,
      username,
      assignedTo: assignedSubadmin._id,
      assignedUsername:assignedSubadmin.username,
      userUnread: true,
      adminUnread: true
    });

    if ((!ticketId, !date, !status, userUnread, !_id))
      return res.status(400).json({ message: "Error while creating ticket." });
const notification={
  title: "New Ticket Assigned to you",
  message: `Subject: ${subject}`,
  url: 'https://app.kkscapitals.com/sub-admin/tickets',
}
await sendNotifications(notification , assignedTo)
    const ticketData = {
      _id,
      ticketId,
      date,
      status,
      userUnread,
      adminUnread,
      subject,
      numberOfReplies: replies.length,
      assignedTo,
      assignedUsername,
      count:1
    };
      emitDataToUser('newTicket',assignedTo,ticketData)
    res
      .status(200)
      .json({ message: "successfully created new ticket", ticketData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error while creating a ticket",
      error: error.message,
    });
  }
};

export const replyToTicket = async (req, res) => {
  try {
    const { userId } = req;
    const {
      ticketId,
      message,
      status,
      image: file,
      cloudinaryResponseData,
    } = req.body;

    if (!ticketId || !userId)
      return res.status(400).json("Missing Datas.");

    const user = await User.findById(userId);
    const ticketData = await ticket.findById(ticketId);

    if (!user || !ticketData)
      return res
        .status(400)
        .json({ message: "Error while fetching user or ticket data." });

    // Basics info stored for all types of messages are stored on pushData object.

    let pushData = {
      userId,
      username: user.username,
      role: user.role,
      userUnread: user.role > 0,
      adminUnread: user.role <= 0,
    };

    // based on the type of message datas are pushed into "pushData" named object,if message is text directly pushed
    // into pushData object, if it is an image first upload it into cloudinary and its url is pushed in to pushData object
    // if it is pdf, cloudinary url coming from frontend is pushed in to pushData object.

    if (message) {
      pushData.message = message;
      pushData.fileFormat = "text";
    } else if (file || cloudinaryResponseData) {
      const { secure_url, format } = file
        ? await cloudinary.uploader.upload(file, {
          folder: "TicketsData",
          upload_preset: "TicketsMessages",
        })
        : cloudinaryResponseData;
      pushData.url = secure_url;
      pushData.fileFormat = format;
    }

    const updateQuery = {
      $push: { replies: pushData },
      status,
      userUnread: user.role > 0,
      adminUnread: user.role <= 0,
    };

    const data = await ticket.findByIdAndUpdate(ticketData._id, updateQuery, {
      new: true,
    });

    if (!data) {
      return res
        .status(400)
        .json({ message: "Error while updating ticket data." });
    }
    const activeUsers = getActiveUsers()
    const receipient = user?.role === 0? data.assignedTo.toString(): data.userId.toString()
    const userIsActive = activeUsers.find(user=>user.userId === receipient)
    if(receipient){
      const notification={
        title: "You have a new message",
        message: `Subject: ${data?.subject}`,
        url: 'https://app.kkscapitals.com/sub-admin/tickets',
      }
      await sendNotifications(notification , userId=receipient)
      emitDataToUser('ticketReply', receipient, data.replies[data.replies.length-1])
      emitDataToUser('newTicketNotification',receipient,data._id)  
    }else{
     const {email} = User.findById(user?.role ===0 ? data?.assignedTo?.toString() : data?.userId?.toString())
      const mailData = {
        username:user?.role >0? data?.username : data?.assignedUsername,
        email:email,
        senderName:user?.role >0? data?.assignedUsername:data?.username,
        subject: data?.subject,
        category:data?.category,
      }
      sendNewMessageNotificationMail(mailData)
    }
    res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const updateAdminRead = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ticketid is missing" })

    const update = await ticket.findByIdAndUpdate(id, { adminUnread: false }, { new: true });
    if (!update) return res.status(400).json({ message: "Error while updating admin read status in ticket schema" })
    res.status(200).json({ message: "Admin read status updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Internal Server Error while updating ticket admin reading status." });
  }
};

export const updateMessageRead = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!userId || !id)
      return res.status(400).json({ message: "missing datas." });

    const { role } = await User.findById(userId);

    if (typeof role !== "number")
      return res
        .status(400)
        .json({ message: "fetching user details failed due to some erros." });

    // based on the role of user updatefield and update conditions are created.

    const isUserAdmin = role >= 1;

    const updateField = isUserAdmin ? "adminUnread" : "userUnread";
    const updateCondition = isUserAdmin
      ? { "replies.$[].adminUnread": 1 }
      : { "replies.$[].userUnread": 1 };


    // upadating ticket schema using this condition.

    const { _id, userUnread, date, replies, subject, ticketId, status , adminUnread } =
      await ticket.findByIdAndUpdate(id, {
        [updateField]: false,
        $unset: updateCondition,
      });

    if (!_id || !date || !replies || !subject || !ticketId || !status)
      return res
        .status(400)
        .json({ message: "Error occured while updating ticket schema." });

    const update = {
      _id,
      date,
      status,
      numberOfReplies: replies.length,
      subject,
      ticketId,
    };

    if (userUnread) update.userUnread = userUnread;
    else update.adminUnread = adminUnread;

    res.status(200).json({
      message: "message readed status updated successfully..",
      update,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message:
        "Internal Server Error occured due to updating ticket read status.",
    });
  }
};

export const closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { userId } = req;

    if (!ticketId || !userId)
      return res.status(400).json({ message: "Missing datas." });

    const { role } = await User.findById(userId);

    if (role < 1)
      return res.status(402).json({ message: "Unauthorized Access." });

    const reply = {
      userId,
      username: "Admin",
      role: 1,
      notification: "close",
    };

    const replay = await ticket.findOneAndUpdate(
      { ticketId },
      { status: false, $push: { replies: reply } },
      { new: true }
    );

    if (!replay)
      return res.status(400).json({
        message: "Error occured while updating reply to ticket schema.",
      });

    res.status(200).json({ message: "ticket closed successfully..", replay });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error while closing ticket.",
      error: error.message,
    });
  }
};

export const reOpenTicket = async (req, res) => {
  try {
    const { userId } = req;
    const { ticketId } = req.params;

    if (!userId || !ticketId)
      return res.status(400).json({ message: "Missing Datas." });

    const { role, username } = await User.findById(userId);

    const reply = {
      userId,
      username,
      role,
      notification: "reopen",
    };

    const replay = await ticket.findOneAndUpdate(
      { ticketId },
      { status: true, $push: { replies: reply } }
    );

    if (!replay)
      return res
        .status(400)
        .json({ message: "Error while updating reopen status." });

    res.status(200).json({ message: "ticket reopened successfully..", replay });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "server error while re-opening ticket.",
        error: error.message,
      });
  }
};

export const getTicketNotificationCount = async (req, res) => {
  try {
    const { userId } = req;

    const { role } = await User.findById(userId);

    if (typeof role !== "number") return res.status(400).json({ message: "getting user details from User collection failed." })

    const isUserAdmin = role >= 1;

    // Query condition is different for type of users.

    const matchQuery = isUserAdmin
      ? { adminUnread: true }
      : { userId: Types.ObjectId(userId), userUnread: true };

    // getting message notification count for users by querying unread messages from database.

    const count = await ticket.aggregate([
      { $match: matchQuery },
      { $count: "count" },
    ]);

    if (!count) return res.status(400).json({ message: "Error while fetching ticket notification count from ticket collection." })

    res.status(200).json({
      message: "ticket count fetched successfully..",
      count: count[0]?.count || 0,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server error while fetching ticket notification count." })
  }
};
export const reassignTicket = async (req, res) => {
  try {
    const { assignTo, ticketId } = req.body;

    const assignedUser = await User.findById(assignTo, {'username':1,email:1});
    if (!assignedUser) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    const response = await ticket.findByIdAndUpdate(
      ticketId,
      { assignedTo: assignTo, assignedUsername: assignedUser.username },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    const data = {
      email: assignedUser?.email,
      username: assignedUser?.username,
      subject:response?.subject,
      category:response?.category,
    }
    sendTicketReAssignedNotificationMail(data)

    res.status(200).json({ message: `Ticket successfully reassigned to ${assignedUser.username}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server error while reassigning ticket' });
  }
};

