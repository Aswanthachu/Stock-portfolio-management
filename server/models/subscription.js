import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
    plan: {
      type: String,
      enum: ["basic", "standard", "premium", "Referal Bonus Plan"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
      default: "0",
    },
    couponCode: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "pending"],
    },
    txnId: {
      type: String,
      unique: true,
      dropDups: true,
    },
    upiTransactionId:{
      type:String,
    }
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

SubscriptionSchema.virtual("user", {
  ref: "user",
  foreignField: "_id",
  localField: "userId",
});

// Set the end date and status based on the subscription type
SubscriptionSchema.pre("save", function (next) {
  const now = new Date(this.startDate);
  if (this.plan === "basic") {
    this.endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
  } else if (this.plan === "standard") {
    this.endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 3,
      now.getDate()
    );
  } else if (this.plan === "premium") {
    this.endDate = new Date(
      now.getFullYear() + 1,
      now.getMonth() + 6,
      now.getDate()
    );
  } else if (this.plan === "Referal Bonus Plan") {
    this.endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
  }
  if (this.endDate < now) {
    this.status = "expired";
  }
  next();
});

const subscription = mongoose.model("subscription", SubscriptionSchema);
export default subscription;
