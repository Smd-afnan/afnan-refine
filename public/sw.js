
// Use the Firebase V9 JS SDK for the service worker
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// This is a special variable that will be replaced by the query parameter.
const firebaseConfigStr = new URL(location).searchParams.get("firebaseConfig");

if (firebaseConfigStr) {
    const firebaseConfig = JSON.parse(decodeURIComponent(firebaseConfigStr));

    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        console.log(
            "[sw.js] Received background message ",
            payload
        );

        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/logo.png' // Make sure you have a logo.png in your public folder
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
} else {
    console.log("Firebase config not found in service worker. Notifications will not work in background.");
}
