import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDoc,
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

async function listenForMessages(callback) {
  const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
  onSnapshot(q, async (snapshot) => {   // <-- 1
    const messages = [];
    for (const change of snapshot.docChanges()) {
      const msgData = change.doc.data();
      const userDoc = await getDoc(doc(db, "users", msgData.uid));
      const username = userDoc.exists() ? userDoc.data().username : "Unknown";
      messages.push({
        id: change.doc.id,
        text: msgData.text,
        username: username,
        createdAt: msgData.createdAt
      });
    }
    callback(messages);  // <-- 2
  });
}

function updateChatLog(messages){
  document.getElementById("messages");
  for (message of messages){
    // const currMsg = document.createElement("span");
    console.log(message);
  }
}

listenForMessages(updateChatLog);