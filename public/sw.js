// This file must be in the public folder.

// Scripts for Firebase
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Get Firebase config from URL query parameter
const urlParams = new URLSearchParams(self.location.search);
const firebaseConfig = JSON.parse(urlParams.get('firebaseConfig'));

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // A default icon for notifications
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
