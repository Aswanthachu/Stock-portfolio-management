import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl, getConfig } from '@/Redux/Api';

const AdminPushNotification = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationText, setNotificationText] = useState('');
  const [notificationLink, setNotificationLink] = useState('');
  const [notificationTTL, setNotificationTTL] = useState(0);
  const [notificationIcon, setNotificationIcon] = useState('');
  const [notificationImage, setNotificationImage] = useState('');

  const sendPushNotification = async () => {
    try {
      const config = getConfig();

      const response = await axios.post(`${baseUrl}/web-push/send-notification`, {
        notification: {
          title: notificationTitle,
          message: notificationText,
          link: notificationLink,
          ttl: notificationTTL,
          icon: notificationIcon,
          image: notificationImage,
        },
      }, config);

    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Send Push Notification</h2>
      <label className="block mb-2">
        Notification Title <span className="text-red-500 text-sm md:text-2xl font-bold">*</span>:
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={notificationTitle}
          onChange={(e) => setNotificationTitle(e.target.value)}
        />
      </label>
      <label className="block mb-2">
        Notification Text <span className="text-red-500 text-sm md:text-2xl font-bold">*</span>:
        <textarea
          className="w-full border border-gray-300 p-2 rounded"
          value={notificationText}
          onChange={(e) => setNotificationText(e.target.value)}
        />
      </label>
      <label className="block mb-2">
        Notification Link <span className="text-red-500 text-sm md:text-2xl font-bold">*</span>:
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={notificationLink}
          onChange={(e) => setNotificationLink(e.target.value)}
        />
      </label>
      <label className="block mb-2">
        Notification TTL: <span>(maximum time limit in seconds)</span>
        <input
          type="number"
          className="w-full border border-gray-300 p-2 rounded"
          value={notificationTTL}
          onChange={(e) => setNotificationTTL(e.target.value)}
        />
      </label>
      {/* <label className="block mb-2">
        Notification Icon:
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={notificationIcon}
          onChange={(e) => setNotificationIcon(e.target.value)}
        />
      </label> */}
      <label className="block mb-2">
        Notification Image:
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={notificationImage}
          onChange={(e) => setNotificationImage(e.target.value)}
        />
      </label>
  
      <button
        className="bg-darkGreen text-white py-2 px-4 rounded hover:bg-teal-900"
        onClick={sendPushNotification}
      >
        Send Notification
      </button>
    </div>
  );
};

export default AdminPushNotification;