import express from 'express'
import { getActiveSubscriptionDetails,getLatestSubscriptions, getSubscriptionDetails, getUserSubscriptionDetails,extendUserSubscription,cancelUserSubscription ,AddUserSubscription,getPlanDetails} from '../controllers/subscriptionController.js'

import { isAdmin,isLogined} from "../middlewares/index.js";

const router = express.Router()

router.get('/get-active-subscriptions',isLogined,isAdmin,getActiveSubscriptionDetails)
router.get('/get-latest-subscriptions',isLogined,isAdmin,getLatestSubscriptions)
router.get('/subscription-details',isLogined,getSubscriptionDetails)
router.get('/get-user-subscription-details/:userId',isLogined,isAdmin,getUserSubscriptionDetails)
router.post('/extend-user-subscription',isLogined,isAdmin,extendUserSubscription)
router.post('/cancel-user-subscription',isLogined,isAdmin,cancelUserSubscription)
router.post('/add-user-subscription',isLogined,isAdmin,AddUserSubscription)
 router.get("/get-plan-details", isLogined, getPlanDetails);

export default router