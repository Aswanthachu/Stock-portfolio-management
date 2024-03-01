import mongoose from "mongoose";
const userLoginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true
  },
  loginHistory: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
        required: true
      },
      ipAddress: {
        type: String,
        required: true
      }
    }
  ]
});

const UserLogin = mongoose.model('UserLogin', userLoginSchema);

export default UserLogin;