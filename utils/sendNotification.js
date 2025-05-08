// utils/sendNotification.js
const admin = require("../firebase");

const sendPushNotification = async (token, title, body) => {
  if (!token) return;

  const message = {
    token,
    notification: {
      title,
      body,
    },
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
  };

  try {
    await admin.messaging().send(message);
    console.log(`✅ Notification sent to token: ${token}`);
  } catch (error) {
    console.error("❌ Failed to send notification:", error.message);
  }
};

module.exports = sendPushNotification;
