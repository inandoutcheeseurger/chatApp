// Import Firebase SDKs (modular, not compat)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyD9ax_a1tmsCSN7XN0gT4evEKwfkyPqmjQ",
  authDomain: "chatapp-2fbf2.firebaseapp.com",
  projectId: "chatapp-2fbf2",
  storageBucket: "chatapp-2fbf2.firebasestorage.app",
  messagingSenderId: "672724465087",
  appId: "1:672724465087:web:76822dbd7b8f09a0ea1d0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth & db so other files can import them
export const auth = getAuth(app);
export const db = getFirestore(app);
