import * as messaging from 'firebase-admin/messaging';

async function sendNotification(
  token: string,
  payload: { title: string; body: string; data: any },
) {
  console.log('Sending FCM notification');
  try {
    const res = await messaging.getMessaging().send({
      token: token,
      data: payload.data,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '10',
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            category: 'NEW_MESSAGE_CATEGORY',
          },
        },
      },
      webpush: {
        headers: {},
      },
    });
    console.log('FCM notification sent', res);
  } catch (err) {
    console.error('Failed to send notification:', err);
  }
}

function sendNotificationBulk(
  tokens: string[],
  payload: { title: string; body: string },
) {
  try {
    messaging.getMessaging().sendEachForMulticast({
      tokens: tokens,
      android: {
        priority: 'high',
        data: {},
        fcmOptions: { analyticsLabel: '' },
        collapseKey: '',
        notification: {
          title: payload.title,
          body: payload.body,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: payload.title,
              body: payload.body,
            },
            sound: 'default', // Customize sound
          },
        },
        headers: {
          'apns-priority': '10', // Sends it immediately
        },
      },
    });
  } catch (err) {
    console.error('Failed to send bulk notification:', err);
  }
}

export default {
  sendNotificationBulk,
  sendNotification,
};
