import * as uuid from "uuid";
import { getPlanDetails as getPlans } from "./plan.js";
import subscription from "../models/subscription.js";
import User from "../models/user.js";
import upiPayment from "../models/upiPayment.js";

export const addToDate = (date, unit, number) => {
  let newDate = new Date(date);

  if (unit === "days") {
    newDate.setDate(newDate.getDate() + number);
  } else if (unit === "weeks") {
    newDate.setDate(newDate.getDate() + number * 7);
  } else if (unit === "months") {
    newDate.setMonth(newDate.getMonth() + number);
  }
  return newDate;
};

// single user subscription details
export const getActiveSubscriptionDetails = async (req, res) => {
  try {
    const subscriptionDetails = await subscription
      .find({ status: "active" })
      .populate("user");
    res.status(200).json(subscriptionDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getLatestSubscriptions = (req, res) => {
  try {
    subscription
      .find()
      .sort({ timestamp: -1 })
      .limit(5)
      .populate("user")
      .exec((err, docs) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
        } else {
          res.status(200).json(docs);
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getSubscriptionDetails = async (req, res) => {
  try {
    const { userId } = req;

    const subscriptionDetails = await subscription
      .find({
        userId: userId,
        $or: [{ status: "active" }, { status: "pending" }],
      })
      .sort({ createdAt: 1 })
      

    if (subscriptionDetails[0]) {
      let comming;
      const current = {
        plan: subscriptionDetails[0].plan,
        planAmount:subscriptionDetails[0].amount,
        purchasedOn:
          subscriptionDetails[0].createdAt.toLocaleDateString("en-GB"),
        endDate: subscriptionDetails[0].endDate.toLocaleDateString("en-GB"),
      };
      if (subscriptionDetails[1]) {
        comming = {
          plan: subscriptionDetails[1].plan,
          planAmount:subscriptionDetails[1].amount,
          purchasedOn:
            subscriptionDetails[1].createdAt.toLocaleDateString("en-GB"),
          endDate: subscriptionDetails[1].endDate.toLocaleDateString("en-GB"),
          startDate:
            subscriptionDetails[1].startDate.toLocaleDateString("en-GB"),
        };
      }
      res.status(200).json({ current, comming ,subscriptionDetails });
    } else {
      res.status(200).json({ current: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};


export const getUserSubscriptionDetails = async(req,res)=>{
  try {
    const {userId} = req.params
    const subscriptions = await subscription.find({ userId, status: { $in: ['active', 'pending'] } })
    res.status(200).json({message:"ok",subscriptions})
  } catch (error) {
    console.log(error);
  }
}

export const extendUserSubscription = async (req, res) => {
  try {
    const { userId, planId, extensionUnit, extensionDays, newEndDate, isUpcomingPlan } = req.body;
    // Update the specified plan's end date
    const updatedPlan = await subscription.findByIdAndUpdate(planId, { endDate: new Date(newEndDate) });

    if (!updatedPlan) {
      return res.status(404).json({ message: 'Plan not found or unable to update end date' });
    }
    if (isUpcomingPlan) {
      const upcoming = await subscription.find({ userId, status: 'pending' });
      if (upcoming.length) {
        await Promise.all(upcoming.map(async (plan) => {
          const newStartDate = addToDate(plan?.startDate, extensionUnit, extensionDays);
          const newEndDate = addToDate(plan?.endDate, extensionUnit, extensionDays);
         await subscription.findByIdAndUpdate(plan._id, { startDate: newStartDate, endDate: newEndDate });
      }))
      }
    } 
    const subscriptions = await subscription.find({ userId, status: { $in: ['active', 'pending'] } })
    return res.status(200).json({ message: 'Subscriptions extended successfully',subscriptions });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while extending subscriptions' });
  }
};

export const cancelUserSubscription = async (req, res) => {
  try {
    const { userId, planId, status, endDate, isUpcomingPlan } = req.body;

    const endDateFromReq = new Date(endDate);
    const currentDate = new Date();
    const differenceInDays = Math.round((endDateFromReq - currentDate) / (24 * 60 * 60 * 1000)) + 1

    await subscription.updateOne({ _id: planId }, { status: 'cancelled' });

    if (isUpcomingPlan) {
      const activePendingSubscriptions = await subscription.find({
        userId,
        status: 'pending',
        endDate: { $gt: endDateFromReq },
      });

      for (const plan of activePendingSubscriptions) {
        const newStartDate = new Date(plan.startDate);
        newStartDate.setDate(newStartDate.getDate() - differenceInDays);
        const newEndDate = new Date(plan.endDate);
        newEndDate.setDate(newEndDate.getDate() - differenceInDays);

        if (status === 'active' && activePendingSubscriptions.indexOf(plan) === 0) {
          await subscription.updateOne(
            { _id: plan._id },
            { startDate: newStartDate, endDate: newEndDate, status: 'active' }
          );
        } else {
          await subscription.updateOne({ _id: plan._id }, { startDate: newStartDate, endDate: newEndDate });
        }
      }
    }

    const subscriptions = await subscription.find({
      userId,
      status: { $in: ['active', 'pending'] },
    });

    return res.status(200).json({ message: 'Subscription cancelled successfully', subscriptions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while cancelling subscriptions' });
  }
};

export const AddUserSubscription = async(req,res)=>{
  try {
   const {plan, userId , upiTransactionId} = req.body
   const user = await User.findOne({ _id: userId });

    // For Referal Bonus
    if (plan === "premium") {
      const prevSubscription = await subscription.find({
        userId: userId,
      });
      if (!prevSubscription[0]) {
       if(user.hasOwnProperty('referedMe')) {
          const referal = await User.findOne({
            referalCode: user.referedMe,
          });
          if (referal) {
            //updating refera
            await User.updateOne(
              { _id: referal._id },
              {
                $push: {
                  referedUsers: {
                    userId,
                    username: user.username,
                    date: new Date().toLocaleDateString("en-GB"),
                  },
                },
              }
            );

            const activeSub = await subscription
              .find({
                userId: referal._id,
              })
              .sort({ createdAt: -1 })
              .limit(1);
            // check whether any active subscription
            let startdate;
            if (activeSub[0]) {
              startdate = new Date(activeSub[0].endDate);
            } else {
              startdate = new Date();
            }
            const subscriptionData = await subscription.create({
              userId: referal._id,
              plan: "Referal Bonus Plan",
              startDate: startdate,
              amount: "0",
              status: activeSub[0] ? "pending" : "active",
            });
          }
        }
      }
    }

    // End of Referal Bonus
      const activeSub = await subscription
        .find({
          userId: userId,
          $or: [
            {
              status: "active",
            },
            {
              status: "pending",
            },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(1);
      // check whether any active subscription
      let startdate;
      if (activeSub[0]) {
        startdate = new Date(activeSub[0].endDate);
      } else {
        startdate = new Date();
      }
      const id = uuid.v4().slice(14); // generates a random UUID
      const timestamp = Date.now(); // gets the current timestamp
      const txnid = `TXN-${id}${timestamp}`; // appends the timestamp to the UUID
      const subscriptionData = await subscription.create({
        userId: userId,
        plan: plan,
        startDate: startdate,
        amount: plan==='premium'? 6915: 2924 ,
        status: activeSub[0] ? "pending" : "active",
        couponCode: "",
        discount:  "",
        txnId:txnid,
      });

      await upiPayment.create({
        email:user.email,
        amount:plan==='premium'? 6915: 2924 ,
        upiTransactionId,
        screenshort: '',
        userId,
        username:user.username,
        plan,
        txnid,
        verified:true
      })

      const subscriptions = await subscription.find({
        userId,
        status: { $in: ['active', 'pending'] },
      });
      res.status(200).json({message:'Successfully added plan to User',subscriptions});
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while adding subscriptions' });

  }
}

export const getPlanDetails = async(req,res)=>{
  try {
    const {userId} = req
    const subscriptions = await subscription.find({userId},{plan:1,amount:1,createdAt:1,startDate:1,endDate:1,status:1})
    const pending = await upiPayment.find({userId,rejected:false,verified:false},{plan:1,amount:1,createdAt:1,})
const recentTransactions = [...subscriptions,...pending]
    res.status(200).json({message:'Plan details fetched successfully',recentTransactions})
  } catch (error) {
    console.error(error);
    return res.status(500).json( {message: 'An error occurred while fetching plan details.', error: error.message });

  }
}