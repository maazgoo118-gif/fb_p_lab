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

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_UID = "jADFKWvwMRXJ742pXKRHgDWdwFo2";

// تسجيل دخول المسؤول
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
        loginStatus.textContent = "هذا الحساب غير مخول بالدخول.";
    } else {
        loginStatus.textContent = "تم تسجيل الدخول بنجاح.";
    }

} catch (error) {
    console.error("Login error:", error);
    loginStatus.textContent = "فشل تسجيل الدخول. تحقق من بيانات الحساب.";
} finally {
    loginButton.disabled = false;
}

});

// تسجيل الخروج
logoutButton.addEventListener("click", async function () {
await auth.signOut();
});

// متابعة حالة تسجيل الدخول
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

// تحميل النشاطات من Firebase
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
        const dateA = a.createdAt ? a.createdAt.toMillis() : 0;
        const dateB = b.createdAt ? b.createdAt.toMillis() : 0;
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

// تحديث لوحة الإدارة كل 10 ثوانٍ
setInterval(function () {
if (auth.currentUser && auth.currentUser.uid === ADMIN_UID) {
loadDashboard();
}
}, 10000);
