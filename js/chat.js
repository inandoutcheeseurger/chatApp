import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDoc,
  doc,
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
  let isInitial = true;

  onSnapshot(q, async (snapshot) => {
    const messages = [];

    if (isInitial) {
      // First load → get ALL docs
      for (const docSnap of snapshot.docs) {
        const msgData = docSnap.data();
        const userDoc = await getDoc(doc(db, "users", msgData.uid));
        const username = userDoc.exists() ? userDoc.data().username : "Unknown";
        messages.push({
          id: docSnap.id,
          uid: msgData.uid,
          text: msgData.text,
          username: username,
          createdAt: msgData.createdAt
        });
      }
      isInitial = false;
    } else {
      // After first load → only new/changed docs
      for (const change of snapshot.docChanges()) {
        if (change.type === "added") {
          const msgData = change.doc.data();
          const userDoc = await getDoc(doc(db, "users", msgData.uid));
          const username = userDoc.exists() ? userDoc.data().username : "Unknown";
          messages.push({
            id: change.doc.id,
            uid: msgData.uid,
            text: msgData.text,
            username: username,
            createdAt: msgData.createdAt
          });
        }
      }
    }

    if (messages.length > 0) {
      callback(messages, auth.currentUser.uid);
    }
  });
}


function updateChatLog(messages, currentUserId) {
  const messageDiv = document.getElementById("messages");

  for (const message of messages) {
    // create a new div for the message
    const currMsgDiv = document.createElement("div");
    currMsgDiv.classList.add("message");

    // mark as mine/theirs and add appropriate classes
    if (message.uid === currentUserId) {
      currMsgDiv.classList.add("mine");  // for my message
    } else {
      currMsgDiv.classList.add("theirs"); // for others' messages

      // Add sender's name above the bubble for others' messages
      const currMsgSender = document.createElement("div");
      currMsgSender.textContent = message.username;
      currMsgSender.classList.add("username");
      currMsgDiv.appendChild(currMsgSender);
    }

    // create the message bubble (text content)
    const currMsgTxt = document.createElement("div");
    currMsgTxt.textContent = message.text;
    currMsgTxt.classList.add("msg-text"); // add a class for the message text
    currMsgDiv.appendChild(currMsgTxt);

    // append to message container
    messageDiv.appendChild(currMsgDiv);

    // optional: scroll to bottom
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }
}



listenForMessages(updateChatLog);