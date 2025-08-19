import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Sign-up function
export async function signUp(email, password, username) {
  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile (optional but useful if you want displayName later)
    await updateProfile(user, {
      displayName: username
    });

    // Store extra info in Firestore under "users" collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      createdAt: new Date()
    });

    console.log("User signed up:", user.email, "with username:", username);
    return user;

  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
}

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const username = document.getElementById("signupUsername").value;
  const passwordCon = document.getElementById("password-con").value;

  if(password !== passwordCon){
    alert("password does not match");
    return;
  }

  try {
    await signUp(email, password, username);
    window.location.href = "chat.html"; // redirect to chat after signup
  } catch (err) {
    alert("Signup failed: " + err.message);
  }
});