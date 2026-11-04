
// ==========================================
// MUHAMMAD ALI - WEDDING INVITATION
// Complete app.js
// ==========================================

const WEDDING = {
  groom: "Muhammad Ali",
  displayMonth: "DECEMBER 2026",

  // Exact date add karein: YYYY-MM-DDTHH:MM:SS
  weddingDate: "2026-12-15T20:00:00",

  // WhatsApp number: country code + number, without +
  whatsappNumber: "92326783951",

  events: [
    {
      name: "Mehndi",
      date: "Date to be announced",
      time: "Time to be announced",
      venue: "Dogar Farm House",
      mapsUrl: "https://maps.app.goo.gl/FfthXSmS56SFwwXk6?g_st=ic"
    },
    {
      name: "Barat",
      date: "Date to be announced",
      time: "Time to be announced",
      venue: "Venue details coming soon",
      mapsUrl: ""
    },
    {
      name: "Walima",
      date: "Date to be announced",
      time: "Time to be announced",
      venue: "Mughal E Azam Event Hall, Mian Channu",
      mapsUrl: "https://maps.app.goo.gl/nRfMVYDDPtsBK3Mf7?g_st=ic"
    }
  ]
};


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

// Firebase console se apni actual configuration
// milne ke baad yahan add karein.

const firebaseConfig = null;

/*
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
*/


// ==========================================
// HERO SECTION
// ==========================================

const groomElement = document.getElementById("groomHero");

if (groomElement) {
  groomElement.textContent = WEDDING.groom;
}

const brideElement = document.getElementById("brideHero");

if (brideElement) {
  brideElement.remove();
}

document.getElementById("heroDate").textContent =
  WEDDING.displayMonth;


// ==========================================
// EVENT DETAILS
// ==========================================

const eventCards = [
  ...document.querySelectorAll(".event-card")
];

WEDDING.events.forEach((event, index) => {
  const card = eventCards[index];

  if (!card) return;

  const details = card.querySelectorAll(
    ".event-detail strong"
  );

  if (details[0]) details[0].textContent = event.date;
  if (details[1]) details[1].textContent = event.time;
  if (details[2]) details[2].textContent = event.venue;

  const map = card.querySelector(".map-link");

  if (!map) return;

  if (event.mapsUrl) {
    map.href = event.mapsUrl;
    map.target = "_blank";
    map.rel = "noopener";
    map.textContent = "MAP & DIRECTIONS ↗";
    map.style.display = "inline-block";
  } else {
    map.removeAttribute("href");
    map.textContent = "LOCATION TO BE ADDED";
    map.style.opacity = ".65";
  }
});


// ==========================================
// COUNTDOWN
// ==========================================

function updateCountdown() {
  if (!WEDDING.weddingDate) return;

  const target = new Date(WEDDING.weddingDate).getTime();

  if (Number.isNaN(target)) return;

  const distance = target - Date.now();

  const values = distance <= 0
    ? [0, 0, 0, 0]
    : [
        Math.floor(distance / 86400000),
        Math.floor((distance % 86400000) / 3600000),
        Math.floor((distance % 3600000) / 60000),
        Math.floor((distance % 60000) / 1000)
      ];

  ["days", "hours", "minutes", "seconds"].forEach(
    (id, index) => {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = String(values[index]).padStart(2, "0");
      }
    }
  );
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================
// BACKGROUND MUSIC
// ==========================================

const audio = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicToggle");

musicButton.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      await audio.play();
      musicButton.innerHTML = "♫ <span>Pause music</span>";
    } else {
      audio.pause();
      musicButton.innerHTML = "♫ <span>Play music</span>";
    }
  } catch (error) {
    alert(
      "Please add your instrumental MP3 at assets/music/instrumental.mp3"
    );
  }
});


// ==========================================
// MOBILE MENU
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
  });
});


// ==========================================
// SHARE INVITATION
// ==========================================

document.getElementById("shareButton").addEventListener(
  "click",
  async () => {
    const shareData = {
      title: "Muhammad Ali - Wedding Invitation",
      text: `You are invited to celebrate Muhammad Ali's wedding in December 2026!`,
      url: location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );

        alert("Invitation link copied successfully!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        alert("Please copy the invitation link from your browser.");
      }
    }
  }
);


// ==========================================
// FIREBASE INITIALIZATION
// ==========================================

let firestoreDatabase = null;
let firestoreCollection = null;
let firestoreAddDoc = null;

async function initializeFirebase() {
  if (!firebaseConfig) return false;

  try {
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"
    );

    const {
      getFirestore,
      collection,
      addDoc
    } = await import(
      "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"
    );

    const app = initializeApp(firebaseConfig);

    firestoreDatabase = getFirestore(app);
    firestoreCollection = collection(
      firestoreDatabase,
      "rsvps"
    );
    firestoreAddDoc = addDoc;

    return true;

  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return false;
  }
}

const firebaseReady = initializeFirebase();


// ==========================================
// RSVP FORM
// ==========================================

const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);

  const data = {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    event: String(formData.get("event") || "").trim(),
    guests: Number(formData.get("guests") || 1),
    message: String(formData.get("message") || "").trim(),
    createdAt: new Date().toISOString()
  };

  if (!data.name || !data.phone || !data.event) {
    formStatus.textContent = "Please complete all required fields.";
    return;
  }

  if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 5) {
    formStatus.textContent = "Please select a valid guest count.";
    return;
  }

  const submitButton = rsvpForm.querySelector(
    'button[type="submit"]'
  );

  submitButton.disabled = true;
  formStatus.textContent = "Preparing your RSVP...";

  try {

    // Save RSVP online if Firebase is configured.
    const isFirebaseReady = await firebaseReady;

    if (isFirebaseReady) {
      await firestoreAddDoc(firestoreCollection, data);
    }

    // Build WhatsApp message.
    const message = [
      "🎉 *NEW WEDDING RSVP*",
      "",
      "Wedding: Muhammad Ali",
      "━━━━━━━━━━━━━━━━",
      `👤 Guest Name: ${data.name}`,
      `📱 Phone: ${data.phone}`,
      `🎊 Event: ${data.event}`,
      `👥 Number of Guests: ${data.guests}`,
      `💬 Message: ${data.message || "No message"}`,
      "",
      `📅 Wedding Month: ${WEDDING.displayMonth}`,
      "━━━━━━━━━━━━━━━━",
      "RSVP received through the wedding invitation website."
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" +
      WEDDING.whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    formStatus.textContent =
      isFirebaseReady
        ? "RSVP saved online. Opening WhatsApp..."
        : "Opening WhatsApp to send your RSVP...";

    // Open WhatsApp with the guest details.
    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    if (!whatsappWindow) {
      formStatus.textContent =
        "WhatsApp popup was blocked. Please allow popups and try again.";
      return;
    }

    formStatus.textContent =
      "Your RSVP is ready in WhatsApp. Please press Send to confirm.";

    rsvpForm.reset();

  } catch (error) {
    console.error("RSVP error:", error);

    formStatus.textContent =
      "Something went wrong. Please try submitting again.";

  } finally {
    submitButton.disabled = false;
  }
});
