const activity = document.getElementById("activity");
const visitors = document.getElementById("visitors");
const tests = document.getElementById("tests");
const updated = document.getElementById("updated");

function loadDashboard() {

    const events = JSON.parse(
        localStorage.getItem("fb_lab_events") || "[]"
    );

    const trainingEvents = events.filter(
        event => event.type === "training_started"
    );

    const messages = events.filter(
        event => event.type === "message"
    );

    visitors.textContent = trainingEvents.length;

    tests.textContent = trainingEvents.length;

    updated.textContent =
        new Date().toLocaleTimeString("ar");

    activity.innerHTML = "";

    if (events.length === 0) {
        activity.textContent =
            "لا توجد نشاطات حتى الآن.";
        return;
    }

    events.slice().reverse().forEach(event => {

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
