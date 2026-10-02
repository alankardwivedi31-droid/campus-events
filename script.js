/* =========================================
   CAMPUSPULSE
   EVENT + ATTENDANCE SYSTEM
========================================= */


/* =========================================
   EVENT IMAGES
========================================= */

const categoryImages = {

  TECH:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85",

  MUSIC:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",

  SPORTS:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",

  CULTURE:
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85"

};


/* =========================================
   EVENTS
   ATTENDED ALWAYS STARTS FROM 0
========================================= */

let events = [

  {
    id: 1,
    name: "Jagran Hackathon 2026",
    category: "TECH",
    capacity: 150,
    attended: 0,
    date: "2026-10-06",
    time: "10:00",
    venue: "Innovation Lab",
    image: categoryImages.TECH
  },


  {
    id: 2,
    name: "Campus Music Night",
    category: "MUSIC",
    capacity: 300,
    attended: 0,
    date: "2026-10-10",
    time: "18:00",
    venue: "Main Auditorium",
    image: categoryImages.MUSIC
  },


  {
    id: 3,
    name: "Inter College Football",
    category: "SPORTS",
    capacity: 500,
    attended: 0,
    date: "2026-10-15",
    time: "16:00",
    venue: "College Ground",
    image: categoryImages.SPORTS
  },


  {
    id: 4,
    name: "Cultural Fest 2026",
    category: "CULTURE",
    capacity: 800,
    attended: 0,
    date: "2026-10-20",
    time: "17:00",
    venue: "Open Air Theatre",
    image: categoryImages.CULTURE
  }

];


/* =========================================
   VARIABLES
========================================= */

let currentFilter = "ALL";

let recentScans = [];

let activeEventId = 1;


/* =========================================
   DOM
========================================= */

const eventGrid = document.getElementById("eventGrid");

const heroEventCount =
  document.getElementById("heroEventCount");

const heroAttendance =
  document.getElementById("heroAttendance");

const liveAttendance =
  document.getElementById("liveAttendance");

const liveCapacity =
  document.getElementById("liveCapacity");

const attendancePercent =
  document.getElementById("attendancePercent");

const attendanceProgress =
  document.getElementById("attendanceProgress");

const scanList =
  document.getElementById("scanList");

const scanCount =
  document.getElementById("scanCount");


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  renderEvents();

  updateDashboard();

  setupFilters();

  setupForm();

});


/* =========================================
   RENDER EVENTS
========================================= */

function renderEvents() {

  if (!eventGrid) return;

  let filteredEvents = events;

  if (currentFilter !== "ALL") {

    filteredEvents = events.filter(
      event => event.category === currentFilter
    );

  }


  eventGrid.innerHTML = "";


  if (filteredEvents.length === 0) {

    eventGrid.innerHTML = `
      <div style="
        grid-column:1/-1;
        padding:50px;
        text-align:center;
        color:#888;
      ">
        No events found.
      </div>
    `;

    return;

  }


  filteredEvents.forEach(event => {

    const card = document.createElement("div");

    card.className =
      `event-card ${event.category.toLowerCase()}`;


    card.innerHTML = `

      <div class="event-image">

        <img
          src="${event.image || categoryImages[event.category]}"
          alt="${event.name}"
          loading="lazy"
        >

        <div class="image-overlay"></div>

        <span class="event-category">
          ${event.category}
        </span>

        <span class="event-date-badge">
          ${formatDate(event.date)}
        </span>

      </div>


      <div class="event-info">

        <h3>
          ${event.name}
        </h3>


        <div class="event-meta">

          <span>
            <i class="fa-regular fa-clock"></i>
            ${formatTime(event.time)}
          </span>

          <span>
            <i class="fa-solid fa-location-dot"></i>
            ${event.venue}
          </span>

        </div>


        <div class="event-bottom">

          <div class="attendance-text">

            <strong>
              ${event.attended}
            </strong>

            /
            ${event.capacity}

            attending

          </div>


          <div class="event-actions">

            <button
              class="event-action"
              onclick="showEventQR(${event.id})"
              title="Generate QR"
            >
              <i class="fa-solid fa-qrcode"></i>
            </button>


            <button
              class="event-action"
              onclick="joinEvent(${event.id})"
              title="Join Event"
            >
              <i class="fa-solid fa-arrow-right"></i>
            </button>

          </div>

        </div>

      </div>

    `;


    eventGrid.appendChild(card);

  });

}


/* =========================================
   FILTERS
========================================= */

function setupFilters() {

  const filters =
    document.querySelectorAll(".filter");


  filters.forEach(button => {

    button.addEventListener("click", () => {

      filters.forEach(btn =>
        btn.classList.remove("active")
      );


      button.classList.add("active");


      currentFilter =
        button.dataset.filter;


      renderEvents();

    });

  });

}


/* =========================================
   CREATE EVENT FORM
========================================= */

function setupForm() {

  const form =
    document.getElementById("eventForm");


  form.addEventListener("submit", function(e) {

    e.preventDefault();


    const name =
      document.getElementById("eventName").value.trim();


    const category =
      document.getElementById("eventCategory").value;


    const capacity =
      Number(
        document.getElementById("eventCapacity").value
      );


    const date =
      document.getElementById("eventDate").value;


    const time =
      document.getElementById("eventTime").value;


    const venue =
      document.getElementById("eventVenue").value.trim();


    const newEvent = {

      id: Date.now(),

      name: name,

      category: category,

      capacity: capacity,

      /* IMPORTANT:
         New event always starts from ZERO
      */
      attended: 0,

      date: date,

      time: time,

      venue: venue,

      image: categoryImages[category]

    };


    events.push(newEvent);


    renderEvents();

    updateDashboard();


    closeCreateModal();


    form.reset();


    showEventQR(newEvent.id);

  });

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateString) {

  if (!dateString) return "TBA";


  const date =
    new Date(dateString);


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short"
    }
  ).toUpperCase();

}


/* =========================================
   TIME FORMAT
========================================= */

function formatTime(timeString) {

  if (!timeString) return "TBA";


  const [hours, minutes] =
    timeString.split(":");


  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);


  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

  /*
    Total attendance of ALL events
  */

  const totalAttendance =
    events.reduce(
      (sum, event) =>
        sum + event.attended,
      0
    );


  /*
    Hero attendance
  */

  if (heroAttendance) {

    heroAttendance.textContent =
      totalAttendance;

  }


  /*
    Event count
  */

  if (heroEventCount) {

    heroEventCount.textContent =
      events.length + "+";

  }


  /*
    Active event for live dashboard
  */

  const activeEvent =
    events.find(
      event => event.id === activeEventId
    ) || events[0];


  if (!activeEvent) return;


  const attended =
    activeEvent.attended;


  const capacity =
    activeEvent.capacity;


  if (liveAttendance) {

    liveAttendance.textContent =
      attended;

  }


  if (liveCapacity) {

    liveCapacity.textContent =
      capacity;

  }


  /*
    Percentage
  */

  let percentage = 0;


  if (capacity > 0) {

    percentage =
      Math.round(
        (attended / capacity) * 100
      );

  }


  if (percentage > 100) {

    percentage = 100;

  }


  if (attendancePercent) {

    attendancePercent.textContent =
      percentage + "%";

  }


  if (attendanceProgress) {

    attendanceProgress.style.width =
      percentage + "%";

  }


  renderScans();

}


/* =========================================
   SIMULATE ATTENDANCE
========================================= */

function simulateScan() {

  /*
    Active event
  */

  const event =
    events.find(
      e => e.id === activeEventId
    ) || events[0];


  if (!event) return;


  /*
    Capacity full check
  */

  if (event.attended >= event.capacity) {

    alert(
      "Event capacity is full!"
    );

    return;

  }


  /*
    Increase attendance by 1
  */

  event.attended += 1;


  /*
    Add recent scan
  */

  const studentNumber =
    event.attended;


  const names = [
    "Student",
    "Participant",
    "Attendee",
    "Campus User",
    "Guest"
  ];


  const randomName =
    names[
      Math.floor(
        Math.random() * names.length
      )
    ];


  recentScans.unshift({

    name:
      randomName +
      " " +
      studentNumber,

    event:
      event.name,

    time:
      new Date().toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )

  });


  /*
    Only keep latest 8 scans
  */

  recentScans =
    recentScans.slice(0, 8);


  /*
    Refresh UI
  */

  renderEvents();

  updateDashboard();

}


/* =========================================
   RECENT SCANS
========================================= */

function renderScans() {

  if (!scanList) return;


  if (recentScans.length === 0) {

    scanList.innerHTML = `

      <div class="empty-scan">

        <i class="fa-solid fa-user-clock"></i>

        <p>
          No attendance yet
        </p>

        <small>
          Scans will appear here
        </small>

      </div>

    `;

  } else {

    scanList.innerHTML =
      recentScans.map(scan => `

        <div class="scan-item">

          <div class="scan-avatar">
            ${scan.name.charAt(0)}
          </div>


          <div class="scan-details">

            <strong>
              ${scan.name}
            </strong>

            <small>
              ${scan.event}
            </small>

          </div>


          <span class="scan-time">
            ${scan.time}
          </span>

        </div>

      `).join("");

  }


  if (scanCount) {

    scanCount.textContent =
      recentScans.length;

  }

}


/* =========================================
   JOIN EVENT
========================================= */

function joinEvent(eventId) {

  const event =
    events.find(
      e => e.id === eventId
    );


  if (!event) return;


  /*
    Make this event active
  */

  activeEventId =
    event.id;


  updateDashboard();


  /*
    If event has capacity
  */

  if (event.attended >= event.capacity) {

    alert(
      "Sorry! This event is already full."
    );

    return;

  }


  const confirmJoin =
    confirm(
      `Join "${event.name}"?\n\nClick OK to mark demo attendance.`
    );


  if (confirmJoin) {

    simulateScan();

  }

}


/* =========================================
   QR GENERATOR
========================================= */

function showEventQR(eventId) {

  const event =
    events.find(
      e => e.id === eventId
    );


  if (!event) return;


  activeEventId =
    event.id;


  const qrModal =
    document.getElementById("qrModal");


  const qrName =
    document.getElementById("qrEventName");


  const qrContainer =
    document.getElementById("qrcode");


  qrName.textContent =
    event.name;


  qrContainer.innerHTML =
    "";


  if (typeof QRCode !== "undefined") {

    new QRCode(qrContainer, {

      text:
        JSON.stringify({

          eventId:
            event.id,

          eventName:
            event.name,

          category:
            event.category

        }),

      width: 200,

      height: 200

    });

  }


  qrModal.classList.add("active");

}


/* =========================================
   CREATE MODAL
========================================= */

function openCreateModal() {

  document
    .getElementById("createModal")
    .classList.add("active");

}


function closeCreateModal() {

  document
    .getElementById("createModal")
    .classList.remove("active");

}


/* =========================================
   QR MODAL
========================================= */

function closeQRModal() {

  document
    .getElementById("qrModal")
    .classList.remove("active");

}


/* =========================================
   SCAN MODAL
========================================= */

function openScanModal() {

  document
    .getElementById("scanModal")
    .classList.add("active");

}


function closeScanModal() {

  document
    .getElementById("scanModal")
    .classList.remove("active");

}


/* =========================================
   CLOSE MODAL ON OUTSIDE CLICK
========================================= */

document.addEventListener("click", function(e) {

  if (e.target.classList.contains("modal")) {

    e.target.classList.remove("active");

  }

});


/* =========================================
   ESC KEY
========================================= */

document.addEventListener("keydown", function(e) {

  if (e.key === "Escape") {

    document
      .querySelectorAll(".modal")
      .forEach(modal => {

        modal.classList.remove("active");

      });

  }

});