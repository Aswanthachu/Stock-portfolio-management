import PushNotification from '../models/pushNotification.js';
import webpush from '../config/webpushConfig.js';


export const sendNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription.subscription, JSON.stringify(payload));
      return { success: true, subscription };
  } catch (error) {
      console.error('Error sending notification:', error);
      if (error.statusCode === 410) {
          // Subscription is no longer valid (e.g., the user uninstalled the app)
          await PushNotification.findByIdAndRemove(subscription._id);
      }
      return { success: false, subscription, error };
  }
};

export const sendNotifications = async (notification, userId = null) => {
  const payload = {
      title: notification.title,
      message: notification.message,
      url: notification.link,
      ttl: notification.ttl,
      icon: notification.icon,
      image: notification.image,
  };

  try {
      let subscriptions;

      if (userId) {
          subscriptions = await PushNotification.find({ userId });
      } else {
          subscriptions = await PushNotification.find();
      }

      const sendNotifications = subscriptions.map(subscription =>
          sendNotification(subscription, payload)
      );

      const results = await Promise.all(sendNotifications);
      return results;
  } catch (error) {
      console.error('Error sending notifications:', error);
      return [];
  }
};


export const subscribePushNotification = async (req, res) => {
    const { subscription } = req.body;
    const {userId} = req
    try {
      await PushNotification.create({userId,subscription});
      res.status(201).json({ message: 'Subscription successful' });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ message: 'Subscription failed' });
    }
  };
export const unsubscribePushNotification = async (req, res) => {
    const { subscription } = req.body;
    const {userId} = req
    try {
        await PushNotification.deleteOne({
            userId,
            'subscription.endpoint': subscription.endpoint,
            'subscription.keys.p256dh': subscription.keys.p256dh,
            'subscription.keys.auth': subscription.keys.auth,
          });
      res.status(200).json({ message: 'Un-Subscribed successfully' });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ message: 'Unsubscribe failed' });
    }
  };
  

export const sendPushNotification = async (req, res) => {
  const { notification } = req.body;

  try {

    const results = await  sendNotifications(notification)
     const successfulSubscriptions = results.filter((result) => result.success).map((result) => result.subscription);
     const failedSubscriptions = results.filter((result) => !result.success).map((result) => result.subscription);

    // Log or handle successful and failed subscriptions as needed

    res.status(200).json({ message: 'Push notification sent successfully' });
  } catch (error) {
    console.error('Notification sending error:', error);
    res.status(500).json({ message: 'Notification sending failed' });
  }
};
export const getNotificationEnabledUsers = async (req, res) => {
  try {

    const notificationEnabledUsers = await PushNotification.aggregate( [
      {
        $group: {
          _id: '$userId', 
          count: { $sum: 1 }, 
        },
      },
      {
        $project: {
          _id: 0, 
          userId: '$_id', 
          count: 1, 
        },
      },
    ]) 

    res.status(200).json({ message: 'Fetched list of users enabled push notification',notificationEnabledUsers });
  } catch (error) {
    console.error('Failed to fetch list of users enabled push notification :', error);
    res.status(500).json({ message: 'Failed to fetch list of users enabled push notification' });
  }
};