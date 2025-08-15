<script type="module">
  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

// TODO: Replace with your Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyD9ax_a1tmsCSN7XN0gT4evEKwfkyPqmjQ",
    authDomain: "chatapp-2fbf2.firebaseapp.com",
    projectId: "chatapp-2fbf2",
    storageBucket: "chatapp-2fbf2.firebasestorage.app",
    messagingSenderId: "672724465087",
    appId: "1:672724465087:web:76822dbd7b8f09a0ea1d0a"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Sign in anonymously
auth.signInAnonymously().catch(err => console.error(err));

// Track current user
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user.uid;
    console.log("Signed in as:", currentUser);
  }
});

// Send message
document.getElementById("sendBtn").onclick = function() {
  const text = document.getElementById("messageInput").value.trim();
  if (text) {
    db.collection("messages").add({
      text: text,
      uid: currentUser,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById("messageInput").value = "";
  }
};

// Listen for new messages
db.collection("messages")
  .orderBy("createdAt")
  .onSnapshot(snapshot => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.classList.add("message");
      if (msg.uid === currentUser) div.classList.add("mine");
      else div.classList.add("theirs");
      div.textContent = msg.text;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
