import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

export const isLogined = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  let decodedData;
  try {
    if (token && token!=="undefined") {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData.id;
      next();
    } else {
      res.status(402).json({ message: "User Not Authenticated.." });
    }
  } catch (error) {
    console.log(error);
  }
};
