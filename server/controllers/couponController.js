import coupon from "../models/coupon.js";
import {Types} from 'mongoose'
export const createCoupon = async (req, res) => {
  try {
    const { couponCode, couponType, couponValue, validTill,  couponDescription } = req.body;
    if (!couponCode || !couponType || !couponValue  ||!validTill ||!couponDescription) {
      res.status(400).json({ message: "Please add all the fields" });
    } else {
      const newCoupon = await coupon.create(req.body);
      const allCoupons = await coupon.find({ couponStatus: "active" });
      res.status(200).json(allCoupons);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { userId } = req;
    const { couponCode, planDetails } = req.body;
    const valid = await coupon.findOne({ couponCode, couponStatus: 'active' });

    if (!valid) {
      return res.status(400).json({ message: "Invalid Coupon" });
    }

    const today = new Date();
    const validTillDate = new Date(valid.validTill);

    if (today > validTillDate) {
      return res.status(400).json({ message: 'Coupon is expired' });
    }

    if (valid.isSingleUse && valid.isCouponUsed.includes(userId)) {
      return res.status(400).json({ message: "Coupon Already Used" });
    }

    if (valid.maxUsage && valid.usageCount >= valid.maxUsage) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    let discount = 0;
    const initialSubTotal = planDetails.planAmount - planDetails.planDiscount;

    if (valid.couponType === "Percentage") {
      discount = Math.round((initialSubTotal * valid.couponValue) / 100);
    } else if (valid.couponType === "Rupees") {
      discount = parseInt(valid.couponValue);
    }

    const subTotal = initialSubTotal - discount;

    res.status(200).json({ valid: true, planDetails: { ...planDetails, discount, subTotal } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "An error occurred while processing the request." });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await coupon.find({ couponStatus: "active" });
    res.status(200).json(coupons);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Failed to fetch coupons",error:error.message});
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    const updatedCoupon = await coupon.updateOne(
      { _id: couponId },
      { couponStatus: "deleted" }
    );
    if (updatedCoupon.modifiedCount > 0) {
      const activeCoupons = await coupon.find({ couponStatus: "active" });
      res.status(200).json({ message: "Coupon deleted successfully",  activeCoupons });
    } else {
      res.status(400).json({ Error: "Coupon Not Found" });
    }
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Failed to delete coupon" ,error:error.message });
  }
};
