// Get elements from the page
const timeline = document.getElementById("timeline");
const moodButtons = document.querySelectorAll(".mood-btn");
const dayViewBtn = document.getElementById("day-view");
const weekViewBtn = document.getElementById("week-view");
const monthViewBtn = document.getElementById("month-view");

// Load moods from LocalStorage, or start with an empty list if there’s a problem
let moods = [];
try {
  moods = JSON.parse(localStorage.getItem("moods")) || [];
} catch (error) {
  console.error("Error loading moods:", error);
  moods = []; // Reset to empty if something goes wrong
}

// When a mood button is clicked, save the mood and update the view
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood; // Get the mood from the button (e.g., "happy")
    const date = new Date().toISOString().split("T")[0]; // Today’s date (e.g., "2025-03-19")
    moods.push({ date, mood }); // Add the mood to the list
    localStorage.setItem("moods", JSON.stringify(moods)); // Save to storage
    renderTimeline("day"); // Show the day view right away
  });
});

// Show the timeline based on the chosen view (day, week, or month)
function renderTimeline(view) {
  timeline.innerHTML = ""; // Clear the timeline area
  const now = new Date();
  let filteredMoods = [];

  // Filter moods based on the view
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

  // If no moods match, show a message
  if (filteredMoods.length === 0) {
    timeline.innerHTML = "<p>No moods logged for this period.</p>";
  } else {
    // Otherwise, show each mood in the timeline
    filteredMoods.forEach((m) => {
      const entry = document.createElement("div"); // Create a new div for each mood
      entry.className = "mood-entry"; // Style it
      entry.innerHTML = `
        <p>${m.date}</p>
        <p>${getEmoji(m.mood)}</p>
      `;
      timeline.appendChild(entry); // Add it to the timeline
    });
  }
}

// Turn mood names into emojis
function getEmoji(mood) {
  const emojis = { happy: "😊", sad: "😢", neutral: "😐", excited: "🤩" };
  return emojis[mood] || "😐"; // Default to neutral if mood is unknown
}

// Buttons to switch views
dayViewBtn.addEventListener("click", () => renderTimeline("day"));
weekViewBtn.addEventListener("click", () => renderTimeline("week"));
monthViewBtn.addEventListener("click", () => renderTimeline("month"));

// Start with the day view when the page loads
renderTimeline("day");
