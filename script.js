const loginForm = document.getElementById("loginForm");
const result = document.getElementById("result");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();

    if (!username) {
        result.textContent = "أدخل اسماً تجريبياً.";
        return;
    }

    const events = JSON.parse(
        localStorage.getItem("fb_lab_events") || "[]"
    );

    events.push({
        type: "training_started",
        date: new Date().toISOString()
    });

    localStorage.setItem(
        "fb_lab_events",
        JSON.stringify(events)
    );

    result.style.color = "#1877f2";
    result.textContent = "بدأ الاختبار بنجاح!";

    loginForm.reset();
});
