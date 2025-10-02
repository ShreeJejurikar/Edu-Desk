// Firebase configuration
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
apiKey: "your-api-key",
authDomain: "your-auth-domain",
projectId: "your-project-id",
storageBucket: "your-storage-bucket",
messagingSenderId: "message-sender-id",
appId: "your-app-id",
measurementId: "measurement-id-optional"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {app , auth , googleProvider}

