// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js");

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZPLPDNrY1AzMvSs2ufMnSm9RxJAqX_qs",
    authDomain: "buyboxbot-2f481.firebaseapp.com",
    projectId: "buyboxbot-2f481",
    storageBucket: "buyboxbot-2f481.firebasestorage.app",
    messagingSenderId: "62646698256",
    appId: "1:62646698256:web:328a9029e36ecab3412595",
    measurementId: "G-38JWX94324"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
