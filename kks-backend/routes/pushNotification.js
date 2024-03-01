import express from 'express'
import { isLogined } from '../middlewares/index.js';
import { sendPushNotification, subscribePushNotification,unsubscribePushNotification,getNotificationEnabledUsers } from '../controllers/pushNotification.js';
const router = express.Router();

router.post('/subscribe',isLogined,subscribePushNotification)
router.post('/unsubscribe',isLogined,unsubscribePushNotification)
router.post('/send-notification',isLogined,sendPushNotification)
router.get('/get-notification-enabled-users',isLogined,getNotificationEnabledUsers)

export default router;