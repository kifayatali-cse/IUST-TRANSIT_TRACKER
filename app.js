// --- 1. FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyPUQ5p_YOUR_API_KEY",
  authDomain: "iust-bus-tracker-b2d05.firebaseapp.com",
  databaseURL: "https://iust-bus-tracker-b2d05-default-rtdb.firebaseio.com",
  projectId: "iust-bus-tracker-b2d05",
  storageBucket: "iust-bus-tracker-b2d05.appspot.com",
  messagingSenderId: "367200021644",
  appId: "1:367200021644:web:2f8623b08e5c10443b7cfc"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();

// --- 2. GLOBAL SYSTEM STATE ---
const awantiporaCampus = [33.9287, 75.0182];
let map = null;
let busMarker = null;
let campusMarker = null;
let currentListenerRef = null;
let activeSessionListenerRef = null;
let currentRole = "student";
let isDriverTracking = false;
let driverWatchId = null;
let myCurrentSessionToken = null;

// Normalizes bus numbers into clean two-digit uniform keys
function normalizeBusId(val) {
  if (!val) return "";
  const cleaned = String(val).trim();
  if (/^\d$/.test(cleaned)) return "0" + cleaned;
  return cleaned;
}

// Generate unique session token for single device locking
function generateSessionToken() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// Clean email key for Firebase DB node
function sanitizeEmailKey(email) {
  return email.replace(/[.#$[\]]/g, '_');
}

// Populate 44 Routes
const routes = [];
for (let i = 1; i <= 44; i++) {
  const formatted = normalizeBusId(i);
  routes.push({ id: formatted, name: `Bus Route #${formatted}` });
}

// --- 3. LEAFLET MAP INITIALIZATION ---
function initMap() {
  if (map) return;
  map = L.map('map', {
    zoomControl: true,
    attributionControl: false
  }).setView(awantiporaCampus, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  const busIcon = L.divIcon({
    className: 'custom-bus-pin',
    html: '<div class="bus-pin-pulse">🚌</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const campusIcon = L.divIcon({
    className: 'custom-campus-pin',
    html: '<div class="campus-pin">🏛️ IUST</div>',
    iconSize: [60, 24],
    iconAnchor: [30, 12]
  });

  busMarker = L.marker(awantiporaCampus, { icon: busIcon }).addTo(map);
  campusMarker = L.marker(awantiporaCampus, { icon: campusIcon }).addTo(map);
}

// --- 4. SINGLE DEVICE SESSION ENFORCER ---
function registerSingleDeviceSession(userEmail) {
  const cleanEmail = sanitizeEmailKey(userEmail);
  myCurrentSessionToken = generateSessionToken();
  localStorage.setItem('iust_session_token', myCurrentSessionToken);

  const sessionRef = db.ref('user_sessions/' + cleanEmail);
  
  // Update the active token in the database
  sessionRef.set({
    activeToken: myCurrentSessionToken,
    lastActive: firebase.database.ServerValue.TIMESTAMP,
    device: navigator.userAgent
  });

  // Listen for other logins on other devices
  if (activeSessionListenerRef) {
    activeSessionListenerRef.off();
  }
  activeSessionListenerRef = sessionRef;

  sessionRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // If another device overwrote the session token
    if (data.activeToken && data.activeToken !== myCurrentSessionToken) {
      alert("⚠️ You have been logged out because your account was opened on another device.");
      logoutSession(true);
    }
  });
}

function clearDeviceSession(userEmail) {
  if (activeSessionListenerRef) {
    activeSessionListenerRef.off();
    activeSessionListenerRef = null;
  }
  localStorage.removeItem('iust_session_token');
  myCurrentSessionToken = null;
}

// --- 5. AUTHENTICATION & SECURITY GATEWAY ---
function switchAuthTab(role) {
  currentRole = role;
  document.getElementById('tabStudent').classList.toggle('active', role === 'student');
  document.getElementById('tabDriver').classList.toggle('active', role === 'driver');
  const label = document.getElementById('authIdLabel');
  const input = document.getElementById('authIdentifier');

  if (role === 'student') {
    label.innerText = 'Student Roll / Registration No.';
    input.placeholder = 'e.g. IUST0120230001 or email@iust.ac.in';
  } else {
    label.innerText = 'Driver Authorized ID / Email';
    input.placeholder = 'e.g. driver.transit@iust.ac.in';
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const feedback = document.getElementById('authFeedback');
  const submitBtn = document.getElementById('authSubmitBtn');
  let idVal = document.getElementById('authIdentifier').value.trim();
  const passVal = document.getElementById('authPassword').value;

  if (!idVal.includes('@')) {
    idVal = idVal.toLowerCase() + '@iust.ac.in';
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Verifying...";
  feedback.innerText = "";

  try {
    const userCredential = await auth.signInWithEmailAndPassword(idVal, passVal);
    
    // Register active device session to block concurrent logins
    registerSingleDeviceSession(userCredential.user.email);

    document.getElementById('authModal').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';

    if (!map) {
      initMap();
    }
    setTimeout(() => {
      map.invalidateSize();
    }, 400);

    setupRoleInterface(currentRole);
  } catch (err) {
    feedback.innerText = "Authentication failed: " + err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Authenticate";
  }
}

function setupRoleInterface(role) {
  const badge = document.getElementById('roleBadge');
  const studentPanel = document.getElementById('studentPanel');
  const driverPanel = document.getElementById('driverPanel');
  const busSelect = document.getElementById('busSelect');
  const driverBusSelect = document.getElementById('driverBusSelect');

  busSelect.innerHTML = '<option value="">-- Choose Bus Route --</option>';
  driverBusSelect.innerHTML = '<option value="">-- Select Your Bus --</option>';

  routes.forEach(r => {
    busSelect.innerHTML += `<option value="${r.id}">${r.name}</option>`;
    driverBusSelect.innerHTML += `<option value="${r.id}">${r.name}</option>`;
  });

  if (role === 'student') {
    badge.innerText = 'Student Portal';
    studentPanel.style.display = 'block';
    driverPanel.style.display = 'none';
  } else {
    badge.innerText = 'Driver Telemetry Mode';
    studentPanel.style.display = 'none';
    driverPanel.style.display = 'block';
  }
}

function logoutSession(forced = false) {
  const currentUser = auth.currentUser;
  if (currentUser && !forced) {
    clearDeviceSession(currentUser.email);
  }
  if (isDriverTracking) {
    stopDriverTracking();
  }
  if (currentListenerRef) {
    currentListenerRef.off();
    currentListenerRef = null;
  }
  auth.signOut();
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('authModal').style.display = 'flex';
}

// --- 6. REAL-TIME MULTI-BUS LISTENER FIX ---
function onBusSelectChange(rawId) {
  const busId = normalizeBusId(rawId);
  const routeName = document.getElementById('telRouteName');
  const status = document.getElementById('telStatus');
  const speed = document.getElementById('telSpeed');
  const eta = document.getElementById('telEta');
  const timestamp = document.getElementById('telTimestamp');

  // CRUCIAL BUGFIX: Detach old listener before subscribing to the new bus
  if (currentListenerRef) {
    currentListenerRef.off();
    currentListenerRef = null;
  }

  if (!busId) {
    routeName.innerText = "None Selected";
    status.innerText = "Offline";
    status.className = "status-offline";
    speed.innerText = "0 km/h";
    eta.innerText = "--";
    timestamp.innerText = "--";
    return;
  }

  routeName.innerText = `Bus Route #${busId}`;
  currentListenerRef = db.ref('buses/' + busId);

  currentListenerRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      status.innerText = "No Data Logged";
      status.className = "status-offline";
      return;
    }

    const lat = Number(data.lat);
    const lng = Number(data.lng);
    const isOnline = data.isOnline;

    if (lat && lng) {
      const pos = new L.LatLng(lat, lng);
      busMarker.setLatLng(pos);
      map.panTo(pos);
    }

    status.innerText = isOnline ? "Live Broadcasting 🟢" : "Parked / Offline ⚪";
    status.className = isOnline ? "status-online" : "status-offline";
    speed.innerText = data.speed ? `${Math.round(data.speed)} km/h` : "0 km/h";
    timestamp.innerText = data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : "--";

    // ETA Calculation
    if (lat && lng) {
      const distKm = getDistanceFromLatLonInKm(lat, lng, awantiporaCampus[0], awantiporaCampus[1]);
      const approxMins = Math.round((distKm / 35) * 60);
      eta.innerText = `~${approxMins} mins (${distKm.toFixed(1)} km to Campus)`;
    }
  });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- 7. DRIVER GPS TELEMETRY & LIVE PIN MOVEMENT ---
function toggleDriverTracking() {
  if (isDriverTracking) {
    stopDriverTracking();
  } else {
    startDriverTracking();
  }
}

function startDriverTracking() {
  const busSelect = document.getElementById('driverBusSelect');
  const busId = normalizeBusId(busSelect.value);
  const statusLog = document.getElementById('driverStatusLog');
  const toggleBtn = document.getElementById('driverToggleBtn');

  if (!busId) {
    alert("Please assign a bus route before starting GPS telemetry.");
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your mobile browser.");
    return;
  }

  isDriverTracking = true;
  toggleBtn.innerText = "🛑 Stop Telemetry Broadcast";
  toggleBtn.className = "btn-danger";

  driverWatchId = navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const spd = position.coords.speed ? (position.coords.speed * 3.6) : 0;
      const accuracy = position.coords.accuracy;

      // Update bus marker on driver's screen
      const driverPos = new L.LatLng(lat, lng);
      busMarker.setLatLng(driverPos);
      map.panTo(driverPos);

      // Push telemetry to Firebase RTDB
      db.ref('buses/' + busId).update({
        lat: lat,
        lng: lng,
        speed: spd,
        accuracy: accuracy,
        isOnline: true,
        lastUpdated: firebase.database.ServerValue.TIMESTAMP
      });

      statusLog.innerHTML = `
        <strong>Satellite Synced:</strong> ±${Math.round(accuracy)}m<br/>
        <strong>Fix:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}<br/>
        <strong>Broadcasting:</strong> Route #${busId}
      `;
    },
    (err) => {
      statusLog.innerText = "GPS Error: " + err.message;
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
}

function stopDriverTracking() {
  const busSelect = document.getElementById('driverBusSelect');
  const busId = normalizeBusId(busSelect.value);
  const toggleBtn = document.getElementById('driverToggleBtn');
  const statusLog = document.getElementById('driverStatusLog');

  if (driverWatchId !== null) {
    navigator.geolocation.clearWatch(driverWatchId);
    driverWatchId = null;
  }

  isDriverTracking = false;
  toggleBtn.innerText = "🛰️ Start Route Telemetry";
  toggleBtn.className = "btn-success";

  // Preserve last location coordinates, only update online status
  if (busId) {
    db.ref('buses/' + busId).update({
      isOnline: false,
      speed: 0,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    });
  }

  statusLog.innerText = "Broadcast stopped. Last punch-out coordinates preserved in cloud.";
}

// --- 8. BULLETPROOF ANDROID/IOS AUDIO & SPLASH INITIALIZER ---
let isTransitAppUnlocked = false;

function unlockAndStartTransit(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (isTransitAppUnlocked) return;
  isTransitAppUnlocked = true;

  // Trigger from the physical DOM audio tag (Bypasses Android Chrome autoplay restrictions)
  const audioEl = document.getElementById('transitAudio');
  if (audioEl) {
    audioEl.currentTime = 0;
    audioEl.volume = 1.0;
    audioEl.muted = false;
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  // Visual radar progression feedback
  const fillBar = document.getElementById('splashLoaderFill');
  const tapBtn = document.getElementById('splashTapBtn');
  if (fillBar) fillBar.classList.add('running');
  if (tapBtn) {
    tapBtn.innerText = "⚡ Initializing Fleet Radar...";
    tapBtn.style.animation = "none";
    tapBtn.style.opacity = "0.85";
  }

  // Dismiss splash and initialize Leaflet mobile view
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
        if (typeof map !== 'undefined' && map) {
          map.invalidateSize();
          map.setView(awantiporaCampus, 13);
        }
      }, 600);
    }
  }, 2600);
}

// Window resize handler for mobile rotation
window.addEventListener('resize', () => {
  if (typeof map !== 'undefined' && map) {
    map.invalidateSize();
  }
});

// Modals
function openCreditsModal() {
  document.getElementById('creditsModal').style.display = 'flex';
}
function closeCreditsModal() {
  document.getElementById('creditsModal').style.display = 'none';
}