const timeline = document.getElementById("timeline");
const moodButtons = document.querySelectorAll(".mood-btn");
const dayViewBtn = document.getElementById("day-view");
const weekViewBtn = document.getElementById("week-view");
const monthViewBtn = document.getElementById("month-view");

let moods = [];
try {
  moods = JSON.parse(localStorage.getItem("moods")) || [];
} catch (error) {
  console.error("Error loading moods:", error);
  moods = [];
}

moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    const date = new Date().toISOString().split("T")[0];
    moods.push({ date, mood });
    localStorage.setItem("moods", JSON.stringify(moods));
    renderTimeline("day");
  });
});

function renderTimeline(view) {
  timeline.innerHTML = "";
  const now = new Date();
  let filteredMoods = [];

  if (view === "day") {
    const today = now.toISOString().split("T")[0];
    filteredMoods = moods.filter((m) => m.date === today);
  } else if (view === "week") {
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    filteredMoods = moods.filter((m) => m.date >= weekAgo);
  } else if (view === "month") {
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    filteredMoods = moods.filter((m) => m.date >= monthAgo);
  }

  if (filteredMoods.length === 0) {
    timeline.innerHTML = "<p>No moods logged for this period.</p>";
  } else {
    filteredMoods.forEach((m) => {
      const entry = document.createElement("div");
      entry.className = "mood-entry";
      entry.innerHTML = `
        <p>${m.date}</p>
        <p>${getEmoji(m.mood)}</p>
      `;
      timeline.appendChild(entry);
    });
  }
}

function getEmoji(mood) {
  const emojis = { happy: "😊", sad: "😢", neutral: "😐", excited: "🤩" };
  return emojis[mood] || "😐";
}

dayViewBtn.addEventListener("click", () => renderTimeline("day"));
weekViewBtn.addEventListener("click", () => renderTimeline("week"));
monthViewBtn.addEventListener("click", () => renderTimeline("month"));

renderTimeline("day");
