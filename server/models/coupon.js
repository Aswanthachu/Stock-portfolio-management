import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: true,
    },
    couponType: {
      type: String,
      enum: ["Percentage", "Rupees"],
      required: true,
    },
    couponValue: {
      type: Number,
      required: true,
    },
    couponStatus: {
      type: String,
      default: "active",
      enum: ["active", "expired", "deleted"],
    },
    validTill: {
      type: Date,
      required: true,
    },
    maxUsage: {
      type: Number,
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },

    couponDescription: {
      type: String,
    },

    isCouponUsed: [],

    isSingleUse: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const coupon = mongoose.model("coupons", couponSchema);
export default coupon
