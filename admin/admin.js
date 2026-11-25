const activity = document.getElementById("activity");
const visitors = document.getElementById("visitors");
const tests = document.getElementById("tests");
const updated = document.getElementById("updated");

function loadDashboard() {
const events = JSON.parse(
localStorage.getItem("fb_lab_events") || "[]"
);

visitors.textContent = events.length;
tests.textContent = events.filter(
    event => event.type === "training_started"
).length;

updated.textContent = new Date().toLocaleTimeString("ar");

if (events.length === 0) {
    activity.textContent = "لا توجد نشاطات حتى الآن.";
    return;
}

activity.innerHTML = "";

events.slice().reverse().forEach(event => {
    const item = document.createElement("p");

    item.textContent =
        "اختبار تدريبي جديد — " +
        new Date(event.date).toLocaleString("ar");

    activity.appendChild(item);
});

}

loadDashboard();

setInterval(loadDashboard, 3000);
