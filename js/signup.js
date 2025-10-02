<script>
document.getElementById("signupForm").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save user in Realtime Database (always save)
      db.ref("users/" + user.uid).set({
        name: name,
        email: email,
        lastLogin: Date.now(),
        verified: user.emailVerified,
        pic: "images/profile1.png"
      })
      .then(() => {
        console.log("✅ User saved to database");
      })
      .catch((err) => {
        console.error("❌ Database write failed:", err);
      });

      // Send verification email separately
      return user.sendEmailVerification()
        .then(() => {
          alert("✅ Verification email sent to " + email + ". Please check your inbox.");
        });
    })
    .then(() => {
      document.getElementById("signupForm").reset();
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
});

// Prevent unverified users from logging in
auth.onAuthStateChanged((user) => {
  if (user) {
    if (!user.emailVerified) {
      alert("⚠️ Please verify your email before logging in.");
      auth.signOut();
    }
  }
});
</script>
