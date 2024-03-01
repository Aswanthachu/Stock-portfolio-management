import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from 'http'
import jwt from 'jsonwebtoken'
import { Server } from "socket.io";
import {
  userRouter,
  paymentRoute,
  ticketRoute,
  subscriptionRoute,
  stockRouter,
  couponRoute,
  planRouter,
  investmentVerificationRouter,
  adminRoute,
  portfolioRouter,
  tutorialVideos,
  selfCreatedPortfolioRouter,
  notificationRouter,
  pushNotificationRouter,
  assistantRouter
} from "./routes/index.js";

import './.env.mjs';

import "./tasks/updateStockPrice.js";
import "./tasks/buySipStocks.js";
import "./tasks/updateSubscriptionStatus.js";
import "./tasks/reminderEmails.js";
import { initializeTicketEvents } from "./controllers/Tickets/ticketEvents.js";
import { limiter } from "./middlewares/limiter.js";
dotenv.config({ path: "./config.env" });

// import "./controllers/aiassistant.js"

export const app = express();

app.use(
  bodyParser.json({
    limit: "30mb",
    extended: "true",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));
app.use(
  cors({
    origin: process.env.CORS_URL,
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
  })
);

// incoming request per user limiting
// app.use(limiter)


const server = http.createServer(app)
export const io = new Server(server,{
  cors:{
    origin: process.env.CORS_URL,
    methods:['GET','POST']
  }
})
io.use((socket,next)=>{
  try{
    const token = socket.handshake.auth.token
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    socket.userId = decoded.id;
    next()
  } catch(error){
next(new Error('Authentication error'))
  }
})
initializeTicketEvents(io)
// app.set("trust proxy", true);
//Routes
app.get('/',(req,res)=>{
  res.send("server running successfully (updated.)")
})
app.use("/api/user/portfolio", stockRouter);
app.use("/api/admin/portfolio", stockRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRoute);
app.use("/api/ticket", ticketRoute);
app.use("/api/subscription", subscriptionRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/plan", planRouter);
app.use("/api/investment-verification", investmentVerificationRouter);
app.use("/api/admin", adminRoute);
app.use("/api/user-portfolio", portfolioRouter);
app.use("/api/tutorials", tutorialVideos);
app.use("/api/self-created-portfolios", selfCreatedPortfolioRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/web-push", pushNotificationRouter);
app.use("/api/assistant",assistantRouter)

const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("server connected with mongoDB "))
  .catch((err) => console.log(err));

server.listen(PORT, () => console.log(`Server Running on ${PORT}`));
