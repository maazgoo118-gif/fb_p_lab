const activity = document.getElementById("activity");
const visitors = document.getElementById("visitors");
const tests = document.getElementById("tests");
const updated = document.getElementById("updated");

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const loginStatus = document.getElementById("loginStatus");
const logoutButton = document.getElementById("logoutButton");

// Firebase initialization
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Admin UID
const ADMIN_UID = "jADFKWvwMRXJ742pXKRHgDWdwFo2";

// Login
loginButton.addEventListener("click", async function () {
const email = adminEmail.value.trim();
const password = adminPassword.value;

if (!email || !password) {
    loginStatus.textContent = "أدخل البريد الإلكتروني وكلمة المرور.";
    return;
}

loginButton.disabled = true;
loginStatus.textContent = "جارٍ تسجيل الدخول...";

try {
    const credential = await auth.signInWithEmailAndPassword(
        email,
        password
    );

    if (credential.user.uid !== ADMIN_UID) {
        await auth.signOut();
        throw new Error("هذا الحساب غير مخول بالدخول.");
    }

    loginStatus.textContent = "تم تسجيل الدخول بنجاح.";

} catch (error) {
    console.error(error);
    loginStatus.textContent = "فشل تسجيل الدخول. تحقق من بيانات الحساب.";
} finally {
    loginButton.disabled = false;
}

});

// Logout
logoutButton.addEventListener("click", async function () {
await auth.signOut();
});

// Authentication state
auth.onAuthStateChanged(async function (user) {
if (user && user.uid === ADMIN_UID) {
loginSection.hidden = true;
dashboardSection.hidden = false;

    await loadDashboard();
} else {
    dashboardSection.hidden = true;
    loginSection.hidden = false;

    if (user) {
        await auth.signOut();
    }
}

});

// Load data from Firestore
async function loadDashboard() {
try {
const snapshot = await db.collection("training_events").get();

    const events = [];

    snapshot.forEach(function (doc) {
        events.push(doc.data());
    });

    const trainingEvents = events.filter(
        event => event.type === "training_started"
    );

    visitors.textContent = trainingEvents.length;
    tests.textContent = trainingEvents.length;

    updated.textContent = new Date().toLocaleTimeString("ar");

    activity.textContent = "";

    if (events.length === 0) {
        activity.textContent = "لا توجد نشاطات حتى الآن.";
        return;
    }

    events.sort(function (a, b) {
        const dateA = a.createdAt
            ? a.createdAt.toMillis()
            : 0;

        const dateB = b.createdAt
            ? b.createdAt.toMillis()
            : 0;

        return dateB - dateA;
    });

    events.forEach(function (event) {
        const item = document.createElement("div");

        item.style.padding = "12px";
        item.style.marginBottom = "10px";
        item.style.background = "#263950";
        item.style.borderRadius = "8px";

        const title = document.createElement("h4");
        const details = document.createElement("p");
        const date = document.createElement("small");

        if (event.type === "message") {
            title.textContent = "إجابة تدريبية جديدة";
            details.textContent = event.message || "";
        } else {
            title.textContent = "بداية اختبار تدريبي";
            details.textContent = "تم بدء اختبار جديد.";
        }

        date.textContent = event.createdAt
            ? event.createdAt.toDate().toLocaleString("ar")
            : "وقت الإرسال غير متوفر";

        item.appendChild(title);
        item.appendChild(details);
        item.appendChild(date);

        activity.appendChild(item);
    });

} catch (error) {
    console.error("Firestore error:", error);
    activity.textContent = "تعذر تحميل النشاطات. تحقق من الاتصال والصلاحيات.";
}

}

// Refresh dashboard every 10 seconds
setInterval(function () {
if (auth.currentUser && auth.currentUser.uid === ADMIN_UID) {
loadDashboard();
}
}, 10000);

        const item = document.createElement("div");

        item.style.padding = "12px";
        item.style.marginBottom = "10px";
        item.style.background = "#263950";
        item.style.borderRadius = "8px";

        const title = document.createElement("h4");

        const details = document.createElement("p");

        const date = document.createElement("small");

        if (event.type === "message") {

            title.textContent = "إجابة تدريبية جديدة";

            details.textContent = event.message;

        } else {

            title.textContent = "بداية اختبار تدريبي";

            details.textContent = "تم بدء اختبار جديد.";

        }

        date.textContent =
            new Date(event.date).toLocaleString("ar");

        item.appendChild(title);
        item.appendChild(details);
        item.appendChild(date);

        activity.appendChild(item);

    });

}

loadDashboard();

setInterval(loadDashboard, 3000);
