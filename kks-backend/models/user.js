import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      default: null,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      default: null,
      unique: true,
    },
    name: {
      type: String,
    },
    mob: {
      type: String,
    },
    hashedPassword: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    uid: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    lastSeen:{
      type:Date
    },
   
    referalCode: {
      type: String,
    },
    referedUsers: {
      type: [],
    },
    referedMe: {
      type: String,
    },
    gender: {
      type: String,
    },
    ageRange: {
      type: String,
    },
    working: {
      type: String,
    },
    working_sector: {
      type: String,
    },
    sip_mutual_fund_hold: {
      type: String,
    },
    demat_Ac: {
      type: String,
    },
    how_long_invest: {
      type: Number,
    },
    portfolios: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "generateportfolio",
      },
    ],
    user_created_portfolios: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "usercreatedportfolio",
      },
    ],
    feedbackSubmitted: {
      type: Boolean,
      default: false,
    },
    notifications: [
      {
        id: {
          type: mongoose.Types.ObjectId,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

userSchema.virtual("subscription", {
  ref: "subscription",
  foreignField: "userId",
  localField: "_id",
});

userSchema.virtual("investmentPlan", {
  ref: "generateportfolio",
  foreignField: "_id",
  localField: "portfolios",
});

userSchema.virtual("loginHistory", {
  ref: "UserLogin",
  foreignField: "userId",
  localField: "_id",
});
const User = mongoose.model("user", userSchema);

export default User;
