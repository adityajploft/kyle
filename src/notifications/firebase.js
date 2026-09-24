// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

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
const app = initializeApp(firebaseConfig);

// Initialize Messaging
export const messaging = getMessaging(app); // Export the messaging object

// Export the generatedToken function
export const generatedToken = async () => {
  const permission = await Notification.requestPermission();
  // console.log(permission, "permission");
  if (permission === "granted") {
    try {
      const token = await getToken(messaging, {
        vapidKey: 'BLvffT-mix59FpCVOxpfS8YhtZtNCzMSvmDDnsgoEVYWW_3wG4EL4kkaUlJrG5BIcj8hSUb05qqTikRUqGObMqU'
      });
      console.log(token,"token")
      return token;
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }
};
