// =====================================
// FB Security Lab
// Firebase connection
// =====================================

const loginForm = document.getElementById("loginForm");
const result = document.getElementById("result");

const sendMessage = document.getElementById("sendMessage");
const adminMessage = document.getElementById("adminMessage");
const messageStatus = document.getElementById("messageStatus");

// Firebase initialization
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Anonymous authentication
let firebaseReady = false;

const authReady = auth.signInAnonymously()
.then(() => {
firebaseReady = true;
console.log("Firebase connected successfully");
})
.catch((error) => {
console.error("Firebase authentication error:", error);
result.textContent = "تعذر الاتصال بالخدمة. حاول لاحقاً.";
});

// Start training
loginForm.addEventListener("submit", async function(e) {

e.preventDefault();

const username = document
    .getElementById("username")
    .value.trim();

if (!username) {
    result.textContent = "أدخل اسماً تجريبياً.";
    return;
}

try {
    await authReady;

    if (!firebaseReady) {
        throw new Error("Authentication unavailable");
    }

    await db.collection("training_events").add({
        type: "training_started",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    result.textContent = "تم بدء الاختبار بنجاح!";
    result.style.color = "#1877f2";

    loginForm.reset();

} catch (error) {
    console.error(error);
    result.textContent = "تعذر بدء الاختبار. حاول مرة أخرى.";
}

});

// Send training answer
sendMessage.addEventListener("click", async function() {

const message = adminMessage.value.trim();

if (!message) {
    messageStatus.textContent = "يرجى كتابة الإجابة أولاً.";
    return;
}

if (message.length > 1000) {
    messageStatus.textContent = "الإجابة طويلة جداً.";
    return;
}

try {
    await authReady;

    if (!firebaseReady) {
        throw new Error("Authentication unavailable");
    }

    await db.collection("training_events").add({
        type: "message",
        message: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageStatus.textContent = "تم إرسال إجابتك بنجاح.";
    messageStatus.style.color = "green";

    adminMessage.value = "";

} catch (error) {
    console.error(error);
    messageStatus.textContent = "تعذر إرسال الإجابة. حاول مرة أخرى.";
}

});
