import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// Ensure only logged-in users can access
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    currentUser = user;
    console.log("Logged in as:", user.email);
  }
});

document.getElementById("logoutBtn").onclick = () => {
  signOut(auth);
};

// Send message
document.getElementById("sendBtn").onclick = async () => {
  const text = document.getElementById("messageInput").value.trim();
  if (text) {
    await addDoc(collection(db, "messages"), {
      text: text,
      uid: currentUser.uid,
      email: currentUser.email,
      createdAt: serverTimestamp()
    });
    document.getElementById("messageInput").value = "";
  }
};

// Listen for new messages
const q = query(collection(db, "messages"), orderBy("createdAt"));
onSnapshot(q, snapshot => {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = doc.data();
    const div = document.createElement("div");
    div.textContent = msg.email + ": " + msg.text;
    messagesDiv.appendChild(div);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});