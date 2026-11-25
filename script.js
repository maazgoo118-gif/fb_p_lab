const loginForm = document.getElementById("loginForm");
const result = document.getElementById("result");

const sendMessage = document.getElementById("sendMessage");
const adminMessage = document.getElementById("adminMessage");
const messageStatus = document.getElementById("messageStatus");

function getEvents() {
    return JSON.parse(
        localStorage.getItem("fb_lab_events") || "[]"
    );
}

function saveEvent(event) {
    const events = getEvents();

    events.push(event);

    localStorage.setItem(
        "fb_lab_events",
        JSON.stringify(events)
    );
}

// بدء الاختبار
loginForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const username = document
        .getElementById("username")
        .value.trim();

    if (!username) {
        result.textContent = "أدخل اسماً تجريبياً.";
        return;
    }

    saveEvent({
        type: "training_started",
        date: new Date().toISOString()
    });

    result.textContent =
        "تم بدء الاختبار بنجاح!";

    result.style.color = "#1877f2";

    loginForm.reset();

});

// إرسال إجابة للمسؤول
sendMessage.addEventListener("click", function() {

    const message = adminMessage.value.trim();

    if (!message) {
        messageStatus.textContent =
            "يرجى كتابة الإجابة أولاً.";
        return;
    }

    saveEvent({
        type: "message",
        message: message,
        date: new Date().toISOString()
    });

    messageStatus.textContent =
        "تم تسجيل إجابتك بنجاح.";

    messageStatus.style.color = "green";

    adminMessage.value = "";

});
