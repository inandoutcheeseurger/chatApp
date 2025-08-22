import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


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

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Send message
document.getElementById("sendBtn").onclick = sendMsg;

document.getElementById("messageInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // stop newline
      sendMsg();          // call your function
    }
    // if Shift+Enter → allow normal newline (do nothing)
});

async function sendMsg(){
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
}

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