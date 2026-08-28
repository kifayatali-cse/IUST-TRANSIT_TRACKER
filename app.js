// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyPUQ5AiJJ6mqxwLUSQiFBoiTv7OZCOAsxA",
  authDomain: "iust-bus-tracker-b2d05.firebaseapp.com",
  databaseURL: "https://iust-bus-tracker-b2d05-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iust-bus-tracker-b2d05",
  storageBucket: "iust-bus-tracker-b2d05.firebasestorage.app",
  messagingSenderId: "41217791418",
  appId: "1:41217791418:web:3147843db6058bbb7e7983"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// --- 2. COMPLETE IUST FLEET LIST ---
const BUS_FLEET = [
  { id: "01", name: "Bus #01", route: "BUS STAND ANANTNAG, KHANABAL, BIJBEHARA TO IUST" },
  { id: "02", name: "Bus #02", route: "BEMINA BYPASS, HYDERPORA, BAGHAT, SANATNAGAR, CHANAPORA BYPASS, NOWGAM TO IUST" },
  { id: "03", name: "Bus #03", route: "RANGRETH, SANATNAGAR CHOWK, CHANAPORA BYPASS, NOWGAM TO IUST" },
  { id: "04", name: "Bus #04", route: "NAGBAL, AHMEDNAGAR, BUCHPORA, ALI JAN ROAD, NALAMAR ROAD, RAJOURI KADAL, BABADEMB, GOUSIA HOSPITAL, TRC TO IUST" },
  { id: "05", name: "Bus #05", route: "BOLSOO, YARIPORA, FRISAL, ARWANI, BIJBEHARA TO IUST" },
  { id: "06", name: "Bus #06", route: "NAGBAL, 90 FEET, ALIJAN ROAD, KARANNAGAR, JAHANGIR CHOWCK, BAGAT BARZULAH, HYDERPORA, NOWGAM, IUST" },
  { id: "07", name: "Bus #07", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "08", name: "Bus #08", route: "BUS STAND ANANTNAG, KHANABAL, BIJBEHARA TO IUST" },
  { id: "09", name: "Bus #09", route: "BUSSTAND TRAL-I-PAYEEN, NAWDAL, CHAK, IUST" },
  { id: "10", name: "Bus #10", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "11", name: "Bus #11", route: "KANITAR, DARGAH, UMMER COLONY, LAL BAZAR, BUDSHAH MOHALLA, MOLVI STOP, MILL STOP TO IUST" },
  { id: "12", name: "Bus #12", route: "HABBAK, MALBAGH, ILAHIBAGH, SAOURA, EIDGAH, SAFAKADAL, KARANAGAR, KAKSARAI, BATAMALOO, LALCHOWK TO IUST" },
  { id: "13", name: "Bus #13", route: "BUS STAND PULWAMA, TANGPUNA, KOIL, MALANGPORA TO IUST" },
  { id: "14", name: "Bus #14", route: "OLD BUS STAND PULWAMA, TANGPUNA, LAJOORA, MALANGPORA TO IUST" },
  { id: "15", name: "Bus #15", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "16", name: "Bus #16", route: "MOLVI STOP, KANITAR, KU, NIT, RAINAWARI, KHANYAR, DALGATE, PAMPORE TO IUST" },
  { id: "17", name: "Bus #17", route: "EIDGAH, SAFAKADAL, KARANAGAR, KAKSARAI, BATAMALOO, LAL CHOWK, SONWAR, PAMPORE TO IUST" },
  { id: "18", name: "Bus #18", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "19", name: "Bus #19", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "20", name: "Bus #20", route: "HABBAK, MALBAGH, ELLAHI BAGH, 90 FEET, NOWSHARA, HAWAL, NOWHATTA, TRC TO IUST" },
  { id: "21", name: "Bus #21", route: "MAGAM, KANIHAMA, NARBAL, HMT, BEMINA, HYDERPORA, BYPASS TO IUST" },
  { id: "21-A", name: "Bus #21-A", route: "HARWAN, SHALIMAR, NISHAT, SONWAR TO IUST" },
  { id: "21-B", name: "Bus #21-B", route: "QAMERWARI CROSSING, BEMINA CROSSING, IQBALABAD GRID STATION, BEMINA BYPASS TO IUST" },
  { id: "22", name: "Bus #22", route: "OMPURA, HYDERPORA, SANATNAGAR, NOWGAM TO IUST" },
  { id: "23", name: "Bus #23", route: "KANIPORA, NOWGAM, PANTHA CHOWK, PAMPORE TO IUST" },
  { id: "24", name: "Bus #24", route: "SHOPIAN, SOOFANAMA, SHIRMAL, TOOKROO, KEIGAM, HALL, BUNDZOO, PULWAMA, KOIL, AIRPORT TO IUST" },
  { id: "25", name: "Bus #25", route: "AABIGHAR TRAL, DADSARA, CHANDRIGAM, TO IUST" },
  { id: "26", name: "Bus #26", route: "AHMEDNAGAR, 90 FEET, SOURA, ALLAMGIRI BAZAR, NOWHATTA, GOUSIA HOSPITAL, KHYAM, DALGATE TO IUST" },
  { id: "27", name: "Bus #27", route: "MATTAN, ANANTNAG, KHANABAL, BIJBEHARA TO IUST" },
  { id: "28", name: "Bus #28", route: "AHMEDNAGAR, UMER HAIR, BUCHPORA, ALI JAN ROAD, NALAMAR ROAD, RAJOURI KADAL, BABDEMB, GOUSIA HOSPITAL, TRC TO IUST" },
  { id: "29", name: "Bus #29", route: "NAGBAL, PANDACH, GULABBAGH, ZAKURA CROSSING, HABAK, KU, RAINAWARI, DALGATE TO IUST" },
  { id: "30", name: "Bus #30", route: "BEMINA BYPASS CROSSING, TENGPORA, HYDERPORA, NOWGAM BYPASS TO IUST" },
  { id: "31", name: "Bus #31", route: "BUS STAND ANANTNAG, KHANABAL, BIJBEHARA TO IUST" },
  { id: "32", name: "Bus #32", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "33", name: "Bus #33", route: "NARBAL, HMT, BEMINA, HYDERPORA BYPASS, NOWGAM BYPASS TO IUST" },
  { id: "34", name: "Bus #34", route: "RAJBAGH, JAWAHARNAGAR, RAMBAGH, CHANAPORA BYPASS, NOWGAM TO IUST" },
  { id: "35", name: "Bus #35", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "36", name: "Bus #36", route: "KULGAM, KAIMOO, KHANABAL, BIJBEHARA TO IUST" },
  { id: "37", name: "Bus #37", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "38", name: "Bus #38", route: "LAZIBAL, ANANTNAG, KHANABAL, BIJBEHARA TO IUST" },
  { id: "39", name: "Bus #39", route: "MOLVI STOP, KANITAR, KU, NIT, RAINAWARI, KHANYAR, DALGATE, PAMPORE TO IUST" },
  { id: "40", name: "Bus #40", route: "CHADOORA, CHANAPORA BYPASS, NOWGAM TO IUST" },
  { id: "41", name: "Bus #41", route: "CAMPUS RESERVE / SPECIAL TRANSIT ROUTE TO IUST" },
  { id: "42", name: "Bus #42", route: "BEMINA BYPASS, HYDERPORA, SANATNAGAR, CHANAPORA BYPASS, NATIPORA, NOWGAM TO IUST" },
  { id: "43", name: "Bus #43", route: "QAZIGUND, KHANABAL, BIJBEHARA TO IUST" },
  { id: "44", name: "Bus #44", route: "RAJPORA, PULWAMA, PRICHOO, GANGOO, PINGLENA, KAKAPORA, SAMBOORA, GALENDAR TO IUST" }
];

// App State Variables
let selectedRole = 'student';
let authMode = 'login';
let activeBusId = "01";
let lockedDriverBusId = null;
let watchId = null;
let pendingGoogleUser = null;
let busOccupancyMap = {};
let currentListenerRef = null;

// Awantipora Campus Target Coordinates
const IUST_LAT = 33.9259;
const IUST_LNG = 75.0165;
const MORNING_AVG_SPEED_KMH = 32;

// --- 3. ABOUT MODAL HANDLERS ---
function openAboutModal() {
  document.getElementById('aboutModal').classList.remove('hidden');
}

function closeAboutModal() {
  document.getElementById('aboutModal').classList.add('hidden');
}

// --- 4. SECURITY LOCKOUT ENGINE ---
const LOCKOUT_DURATION_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 3;

function checkSecurityLockout() {
  const lockoutUntil = localStorage.getItem('iust_sec_lockout');
  const errorBox = document.getElementById('authError');
  const actionBtn = document.getElementById('authActionBtn');

  if (lockoutUntil) {
    const remainingMs = parseInt(lockoutUntil, 10) - Date.now();
    if (remainingMs > 0) {
      const remainingMins = Math.ceil(remainingMs / 60000);
      errorBox.innerText = `⛔ Device locked for security violations. Try again in ${remainingMins} minutes.`;
      actionBtn.disabled = true;
      actionBtn.style.opacity = "0.5";
      actionBtn.style.cursor = "not-allowed";
      return true;
    } else {
      localStorage.removeItem('iust_sec_lockout');
      localStorage.removeItem('iust_sec_strikes');
      actionBtn.disabled = false;
      actionBtn.style.opacity = "1";
      actionBtn.style.cursor = "pointer";
    }
  }
  return false;
}

function recordSecurityViolation() {
  let strikes = parseInt(localStorage.getItem('iust_sec_strikes') || '0', 10) + 1;
  localStorage.setItem('iust_sec_strikes', strikes);

  if (strikes >= MAX_ATTEMPTS) {
    const lockoutTimestamp = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem('iust_sec_lockout', lockoutTimestamp);
    checkSecurityLockout();
  } else {
    const errorBox = document.getElementById('authError');
    errorBox.innerText = `Invalid credentials. Security Warning: ${MAX_ATTEMPTS - strikes} attempts remaining before 30-min lockout.`;
  }
}

function normalizeBusId(id) {
  if (!id) return "01";
  const str = String(id).trim();
  if (str.includes("-")) return str;
  return str.padStart(2, '0');
}

function isValidStudentRegId(regId) {
  const cleanId = regId.replace(/\s+/g, '').toUpperCase();
  const iustPattern = /^IUST01[0-9A-Z]{4,10}$/;
  return {
    isValid: iustPattern.test(cleanId),
    formattedId: cleanId
  };
}

function isValidFacultyId(empId) {
  const cleanId = empId.trim().toUpperCase();
  return {
    isValid: cleanId.length >= 3,
    formattedId: cleanId
  };
}

function isMorningInboundWindow() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const morningStartMinutes = 7 * 60 + 30;
  const morningEndMinutes = 10 * 60 + 0;
  return currentMinutes >= morningStartMinutes && currentMinutes <= morningEndMinutes;
}

function initOccupancyListener() {
  db.ref('bus_assignments').on('value', (snapshot) => {
    busOccupancyMap = snapshot.val() || {};
    populateFleetSelectors();
    updateRouteDisplays();
  });
}

function populateFleetSelectors() {
  const studentSelect = document.getElementById('routeSelect');
  const driverSelect = document.getElementById('driverBusSelect');
  const regBusSelect = document.getElementById('driverRegistrationBusSelect');

  studentSelect.innerHTML = "";
  driverSelect.innerHTML = "";
  regBusSelect.innerHTML = "";

  BUS_FLEET.forEach((bus) => {
    const normId = normalizeBusId(bus.id);
    const isOccupied = busOccupancyMap[normId];
    const occupiedText = isOccupied ? ` [OCCUPIED by ${isOccupied.driverName}]` : " [AVAILABLE]";

    const optS = document.createElement('option');
    optS.value = normId;
    optS.innerText = `${bus.name} — ${bus.route.split(',')[0]}${isOccupied ? ' (Active)' : ''}`;
    studentSelect.appendChild(optS);

    const optD = document.createElement('option');
    optD.value = normId;
    optD.innerText = `${bus.name} — ${bus.route.split(',')[0]}`;
    driverSelect.appendChild(optD);

    const optReg = document.createElement('option');
    optReg.value = normId;
    optReg.innerText = `${bus.name}${occupiedText} — ${bus.route.split(',')[0]}`;
    if (isOccupied && (!pendingGoogleUser || isOccupied.driverUid !== pendingGoogleUser.uid)) {
      optReg.disabled = true;
      optReg.style.color = "#94a3b8";
    }
    regBusSelect.appendChild(optReg);
  });

  const curActive = normalizeBusId(activeBusId);
  if (studentSelect.querySelector(`option[value="${curActive}"]`)) {
    studentSelect.value = curActive;
  }
}

function updateRouteDisplays() {
  const normActive = normalizeBusId(activeBusId);
  const studentBus = BUS_FLEET.find(b => normalizeBusId(b.id) === normActive);
  if (studentBus) {
    const occ = busOccupancyMap[normActive];
    const occTag = occ ? `<span style="color:#059669; font-weight:700;"> (Assigned Driver: ${occ.driverName})</span>` : "";
    document.getElementById('routeStopsDisplay').innerHTML = `<strong>Morning Route:</strong> ${studentBus.route}${occTag}`;
  }

  const driverBusToUse = normalizeBusId(lockedDriverBusId || document.getElementById('driverBusSelect').value);
  const driverBus = BUS_FLEET.find(b => normalizeBusId(b.id) === driverBusToUse);
  if (driverBus) {
    document.getElementById('driverRouteDisplay').innerHTML = `<strong>Locked Route:</strong> ${driverBus.route}`;
  }
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function computeMorningEtaMinutes(distKm, currentSpeed) {
  const speed = (currentSpeed > 10) ? currentSpeed : MORNING_AVG_SPEED_KMH;
  return Math.round((distKm / speed) * 60);
}

// --- 5. AUTHENTICATION & DASHBOARD WORKFLOW ---
function setAuthRole(role) {
  selectedRole = role;
  document.getElementById('tabStudent').classList.toggle('active', role === 'student');
  document.getElementById('tabFaculty').classList.toggle('active', role === 'faculty');
  document.getElementById('tabDriver').classList.toggle('active', role === 'driver');
  updateFormLayout();
}

function setAuthMode(mode) {
  authMode = mode;
  document.getElementById('modeLogin').classList.toggle('active', mode === 'login');
  document.getElementById('modeSignup').classList.toggle('active', mode === 'signup');
  updateFormLayout();
}

function updateFormLayout() {
  const isDriver = (selectedRole === 'driver');
  const isFaculty = (selectedRole === 'faculty');
  const isStudent = (selectedRole === 'student');
  const isSignup = (authMode === 'signup');
  const isOnboarding = (authMode === 'google_onboarding');

  document.getElementById('googleAuthSection').classList.toggle('hidden', isSignup || isOnboarding);
  document.getElementById('emailPasswordSection').classList.toggle('hidden', isOnboarding);
  document.getElementById('rememberMeSection').classList.toggle('hidden', isOnboarding);
  document.getElementById('authModeToggleContainer').classList.toggle('hidden', isOnboarding);

  document.getElementById('nameGroup').classList.toggle('hidden', !(isSignup || isOnboarding));
  document.getElementById('studentRegGroup').classList.toggle('hidden', !((isSignup || isOnboarding) && isStudent));
  document.getElementById('facultyIdGroup').classList.toggle('hidden', !((isSignup || isOnboarding) && isFaculty));
  document.getElementById('phoneGroup').classList.toggle('hidden', !((isSignup || isOnboarding) && isDriver));
  document.getElementById('driverIdGroup').classList.toggle('hidden', !((isSignup || isOnboarding) && isDriver));
  document.getElementById('driverBusSelectGroup').classList.toggle('hidden', !((isSignup || isOnboarding) && isDriver));

  if (isOnboarding) {
    document.getElementById('portalTagTitle').innerText = "⚠️ First-Time Verification Required";
    document.getElementById('portalTagSub').innerText = "Submit your credentials to activate campus access.";
    document.getElementById('authActionBtn').innerText = "Complete Registration & Enter";
  } else if (isSignup) {
    document.getElementById('portalTagTitle').innerText = "Official Campus Fleet Tracking Portal";
    document.getElementById('portalTagSub').innerText = "Morning inbound live radar restricted to university members.";
    document.getElementById('authActionBtn').innerText = "Register Account";
  } else {
    document.getElementById('portalTagTitle').innerText = "Official Campus Fleet Tracking Portal";
    document.getElementById('portalTagSub').innerText = "Morning inbound live radar restricted to university members.";
    document.getElementById('authActionBtn').innerText = "Sign In with Credentials";
  }
  document.getElementById('authError').innerText = "";
}

function configureAuthPersistence() {
  const remember = document.getElementById('rememberMeCheckbox').checked;
  const persistenceType = remember 
    ? firebase.auth.Auth.Persistence.LOCAL 
    : firebase.auth.Auth.Persistence.SESSION;
  return auth.setPersistence(persistenceType);
}

function handleGoogleAuth() {
  if (checkSecurityLockout()) return;

  const errorBox = document.getElementById('authError');
  errorBox.innerText = "Connecting to Google...";

  configureAuthPersistence().then(() => {
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        db.ref('users/' + user.uid).once('value').then((snap) => {
          const profile = snap.val();
          if (profile && profile.role) {
            finalizeLogin(user);
          } else {
            pendingGoogleUser = user;
            authMode = 'google_onboarding';
            document.getElementById('authName').value = user.displayName || "";
            updateFormLayout();
          }
        });
      })
      .catch((error) => { errorBox.innerText = error.message; });
  });
}

function handleCompleteGoogleOnboarding() {
  if (checkSecurityLockout()) return;

  const name = document.getElementById('authName').value.trim();
  const errorBox = document.getElementById('authError');

  if (!name) {
    errorBox.innerText = "Please enter your Full Name.";
    return;
  }

  if (selectedRole === 'driver') {
    const phone = document.getElementById('authPhone').value.trim();
    const driverId = document.getElementById('authDriverId').value.trim();
    const chosenBus = normalizeBusId(document.getElementById('driverRegistrationBusSelect').value);

    if (!phone || !driverId || !chosenBus) {
      errorBox.innerText = "Please provide Phone Number, Driver ID, and select an available Bus.";
      return;
    }

    if (busOccupancyMap[chosenBus] && busOccupancyMap[chosenBus].driverUid !== pendingGoogleUser.uid) {
      errorBox.innerText = `Bus #${chosenBus} is already claimed by ${busOccupancyMap[chosenBus].driverName}.`;
      return;
    }

    db.ref('bus_assignments/' + chosenBus).set({
      driverUid: pendingGoogleUser.uid,
      driverName: name,
      driverPhone: phone
    });

    db.ref('users/' + pendingGoogleUser.uid).set({
      name: name,
      email: pendingGoogleUser.email,
      phone: phone,
      driverId: driverId,
      role: 'driver',
      assignedBusId: chosenBus,
      createdAt: Date.now()
    }).then(() => finalizeLogin(pendingGoogleUser));

  } else if (selectedRole === 'faculty') {
    const rawEmpId = document.getElementById('authFacultyId').value.trim();
    const validation = isValidFacultyId(rawEmpId);

    if (!validation.isValid) {
      purgeUnverifiedAccount(pendingGoogleUser);
      recordSecurityViolation();
      return;
    }

    db.ref('users/' + pendingGoogleUser.uid).set({
      name: name,
      email: pendingGoogleUser.email,
      facultyId: validation.formattedId,
      role: 'faculty',
      createdAt: Date.now()
    }).then(() => finalizeLogin(pendingGoogleUser));

  } else {
    const rawRegId = document.getElementById('authRegId').value.trim();
    const validation = isValidStudentRegId(rawRegId);

    if (!validation.isValid) {
      purgeUnverifiedAccount(pendingGoogleUser);
      recordSecurityViolation();
      return;
    }

    db.ref('users/' + pendingGoogleUser.uid).set({
      name: name,
      email: pendingGoogleUser.email,
      registrationId: validation.formattedId,
      role: 'student',
      createdAt: Date.now()
    }).then(() => finalizeLogin(pendingGoogleUser));
  }
}

function purgeUnverifiedAccount(user) {
  if (user) {
    user.delete().catch(() => {
      auth.signOut();
    });
  }
  pendingGoogleUser = null;
  authMode = 'login';
  setAuthMode('login');
}

function handleAuthSubmit() {
  if (checkSecurityLockout()) return;

  if (authMode === 'google_onboarding') {
    handleCompleteGoogleOnboarding();
  } else if (authMode === 'signup') {
    handleManualSignup();
  } else {
    handleEmailPasswordLogin();
  }
}

function handleManualSignup() {
  if (checkSecurityLockout()) return;

  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const errorBox = document.getElementById('authError');

  if (!name || !email || !password) {
    errorBox.innerText = "Please complete all fields.";
    return;
  }

  if (selectedRole === 'student') {
    const rawRegId = document.getElementById('authRegId').value.trim();
    const validation = isValidStudentRegId(rawRegId);

    if (!validation.isValid) {
      recordSecurityViolation();
      return;
    }
  }

  if (selectedRole === 'driver') {
    const phone = document.getElementById('authPhone').value.trim();
    const driverId = document.getElementById('authDriverId').value.trim();
    const chosenBus = normalizeBusId(document.getElementById('driverRegistrationBusSelect').value);

    if (!phone || !driverId || !chosenBus) {
      errorBox.innerText = "Please provide Driver Name, Phone Number, Driver ID, and Assigned Bus.";
      return;
    }

    if (busOccupancyMap[chosenBus]) {
      errorBox.innerText = `Bus #${chosenBus} is already claimed by ${busOccupancyMap[chosenBus].driverName}.`;
      return;
    }

    errorBox.innerText = "Registering Driver account...";
    configureAuthPersistence().then(() => {
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          db.ref('bus_assignments/' + chosenBus).set({
            driverUid: uid,
            driverName: name,
            driverPhone: phone
          });

          db.ref('users/' + uid).set({
            name: name,
            email: email,
            phone: phone,
            driverId: driverId,
            role: 'driver',
            assignedBusId: chosenBus,
            createdAt: Date.now()
          });

          finalizeLogin(userCredential.user);
        })
        .catch((error) => { errorBox.innerText = error.message; });
    });

  } else if (selectedRole === 'faculty') {
    const rawEmpId = document.getElementById('authFacultyId').value.trim();
    const validation = isValidFacultyId(rawEmpId);

    if (!validation.isValid) {
      recordSecurityViolation();
      return;
    }

    errorBox.innerText = "Registering Faculty/Staff account...";
    configureAuthPersistence().then(() => {
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          db.ref('users/' + uid).set({
            name: name,
            email: email,
            facultyId: validation.formattedId,
            role: 'faculty',
            createdAt: Date.now()
          });

          finalizeLogin(userCredential.user);
        })
        .catch((error) => { errorBox.innerText = error.message; });
    });

  } else {
    const rawRegId = document.getElementById('authRegId').value.trim();
    const validation = isValidStudentRegId(rawRegId);

    errorBox.innerText = "Registering Student account...";
    configureAuthPersistence().then(() => {
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          db.ref('users/' + uid).set({
            name: name,
            email: email,
            registrationId: validation.formattedId,
            role: 'student',
            createdAt: Date.now()
          });

          finalizeLogin(userCredential.user);
        })
        .catch((error) => { errorBox.innerText = error.message; });
    });
  }
}

function handleEmailPasswordLogin() {
  if (checkSecurityLockout()) return;

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const errorBox = document.getElementById('authError');

  if (!email || !password) {
    errorBox.innerText = "Please enter your email and password.";
    return;
  }

  errorBox.innerText = "Authenticating...";
  configureAuthPersistence().then(() => {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        finalizeLogin(userCredential.user);
      })
      .catch((error) => {
        errorBox.innerText = error.message;
        recordSecurityViolation();
      });
  });
}

function finalizeLogin(user) {
  localStorage.removeItem('iust_sec_strikes');
  localStorage.removeItem('iust_sec_lockout');

  document.getElementById('authError').innerText = "";
  document.getElementById('authModal').classList.add('hidden');
  db.ref('users/' + user.uid).once('value').then((snap) => {
    const userData = snap.val();
    const role = (userData && userData.role) ? userData.role : selectedRole;
    setupUserDashboard(role, user.email, user.uid);
  });
}

function handleLogout() {
  if (watchId !== null) stopDriverTracking();
  auth.signOut().then(() => {
    document.getElementById('authModal').classList.remove('hidden');
    authMode = 'login';
    setAuthMode('login');
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    db.ref('users/' + user.uid).once('value').then((snap) => {
      const userData = snap.val();
      if (userData && userData.role) {
        document.getElementById('authModal').classList.add('hidden');
        setupUserDashboard(userData.role, user.email, user.uid);
      } else {
        pendingGoogleUser = user;
        authMode = 'google_onboarding';
        document.getElementById('authModal').classList.remove('hidden');
        document.getElementById('authName').value = user.displayName || "";
        updateFormLayout();
      }
    });
  } else {
    document.getElementById('authModal').classList.remove('hidden');
  }
});

function setupUserDashboard(role, email, uid) {
  db.ref('users/' + uid).once('value').then((snapshot) => {
    const userData = snapshot.val() || {};
    const displayName = userData.name || email;
    const roleTag = (role === 'faculty') ? 'FACULTY' : role.toUpperCase();
    document.getElementById('userBadge').innerText = `${roleTag} | ${displayName}`;

    if (role === 'student' || role === 'faculty') {
      document.getElementById('studentPanel').classList.remove('hidden');
      document.getElementById('driverPanel').classList.add('hidden');
      listenToBusUpdates(normalizeBusId(activeBusId));
    } else {
      document.getElementById('studentPanel').classList.add('hidden');
      document.getElementById('driverPanel').classList.remove('hidden');

      lockedDriverBusId = normalizeBusId(userData.assignedBusId || "01");
      document.getElementById('driverBusSelect').value = lockedDriverBusId;
      updateRouteDisplays();

      // Immediately render driver's locked bus coordinates
      listenToBusUpdates(lockedDriverBusId);
    }

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 400);
  });
}

// --- 6. MAP & TELEMETRY ENGINE (WITH GHOST-MARKER DETACHMENT) ---
const awantiporaCampus = [IUST_LAT, IUST_LNG];
const map = L.map('map', {
  center: awantiporaCampus,
  zoom: 13,
  zoomControl: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors | IUST Transit Hub'
}).addTo(map);

L.marker(awantiporaCampus)
  .addTo(map)
  .bindPopup("<b>🏛️ IUST Awantipora Main Campus</b><br>Target Inbound Destination")
  .openPopup();

const busIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22]
});

let busMarker = L.marker(awantiporaCampus, { icon: busIcon })
  .addTo(map)
  .bindPopup("<b>Bus Telemetry</b><br>Awaiting signal...");

function listenToBusUpdates(rawBusId) {
  const busId = normalizeBusId(rawBusId);

  // 1. Immediately detach previous listener so old bus GPS never pulls the marker back
  if (currentListenerRef) {
    currentListenerRef.off();
    currentListenerRef = null;
  }

  // 2. Attach clean listener strictly to new bus ID
  currentListenerRef = db.ref('buses/' + busId);

  currentListenerRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const assignedDriver = busOccupancyMap[busId];

    if (assignedDriver) {
      document.getElementById('busDriverName').innerText = assignedDriver.driverName || "Assigned Driver";
      document.getElementById('busDriverPhone').innerHTML = assignedDriver.driverPhone 
        ? `<a href="tel:${assignedDriver.driverPhone}" class="driver-tel-link">📞 ${assignedDriver.driverPhone}</a>`
        : "Not Provided";
    } else {
      document.getElementById('busDriverName').innerText = "Unassigned";
      document.getElementById('busDriverPhone').innerText = "N/A";
    }

    if (data && data.lat && data.lng) {
      const lat = Number(data.lat);
      const lng = Number(data.lng);
      const newLatLng = new L.LatLng(lat, lng);
      
      busMarker.setLatLng(newLatLng);
      map.panTo(newLatLng);

      const distanceKm = calculateDistanceKm(lat, lng, IUST_LAT, IUST_LNG);
      const inMorningWindow = isMorningInboundWindow();

      let displayEta = "-- mins";
      let popupEta = "";

      if (inMorningWindow) {
        const etaMinutes = computeMorningEtaMinutes(distanceKm, data.speed || 0);
        displayEta = `~${etaMinutes} mins to IUST`;
        popupEta = `<br>Morning ETA: ~${etaMinutes} mins`;
      } else {
        displayEta = "Outbound / Off-Peak (ETA Inactive)";
        popupEta = "<br>Service: Outbound / Off-Peak";
      }

      const now = Date.now();
      const isHalted = data.isOnline && (data.speed < 2) && data.lastMovedTimestamp && ((now - data.lastMovedTimestamp) > 60000);
      const haltAlertElement = document.getElementById('haltAlertBox');

      if (isHalted) {
        haltAlertElement.classList.remove('hidden');
      } else {
        haltAlertElement.classList.add('hidden');
      }

      const driverContactInfo = assignedDriver ? `<br>Driver: ${assignedDriver.driverName} (${assignedDriver.driverPhone || 'N/A'})` : "";

      if (data.isOnline) {
        document.getElementById('busStatus').innerText = isHalted ? "Halted in Traffic ⚠️" : "In Transit 🟢";
        document.getElementById('busDist').innerText = `${distanceKm.toFixed(1)} km`;
        document.getElementById('busEta').innerText = displayEta;
        document.getElementById('busSpeed').innerText = `${data.speed} km/h`;
        document.getElementById('lastPing').innerText = new Date(data.timestamp).toLocaleTimeString();
        busMarker.getPopup().setContent(`<b>Bus #${busId}</b><br>Status: ${isHalted ? 'Halted in Traffic ⚠️' : 'In Transit 🟢'}<br>Speed: ${data.speed} km/h${popupEta}${driverContactInfo}`);
      } else {
        document.getElementById('busStatus').innerText = "Offline / In Yard 🔴";
        document.getElementById('busDist').innerText = `${distanceKm.toFixed(1)} km`;
        document.getElementById('busEta').innerText = "Trip Concluded";
        document.getElementById('busSpeed').innerText = "0 km/h";
        document.getElementById('lastPing').innerText = `Punched out at ${new Date(data.timestamp).toLocaleTimeString()}`;
        busMarker.getPopup().setContent(`<b>Bus #${busId}</b><br>Status: Trip Ended 🔴<br>Last recorded at ${new Date(data.timestamp).toLocaleTimeString()}${driverContactInfo}`);
      }
    } else {
      busMarker.setLatLng(awantiporaCampus);
      map.panTo(awantiporaCampus);
      document.getElementById('haltAlertBox').classList.add('hidden');

      document.getElementById('busStatus').innerText = "In Yard / Offline 🔴";
      document.getElementById('busDist').innerText = "-- km";
      document.getElementById('busEta').innerText = "-- mins";
      document.getElementById('busSpeed').innerText = "0 km/h";
      document.getElementById('lastPing').innerText = "No signal received";
      busMarker.getPopup().setContent(`<b>Bus #${busId}</b><br>Status: In Yard / Offline`);
    }
  });
}

function onRouteSelect() {
  activeBusId = normalizeBusId(document.getElementById('routeSelect').value);
  updateRouteDisplays();
  listenToBusUpdates(activeBusId);
}

// --- 7. DRIVER TELEMETRY BROADCASTER (WITH LIVE DRIVER PIN UPDATE) ---
let lastRecordedLat = null;
let lastRecordedLng = null;
let lastMovedTime = Date.now();

function startDriverTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your device.");
    return;
  }

  const busId = normalizeBusId(lockedDriverBusId);
  document.getElementById('gpsStatus').innerText = "Acquiring High-Precision GPS Lock...";
  document.getElementById('startTripBtn').classList.add('hidden');
  document.getElementById('stopTripBtn').classList.remove('hidden');

  lastMovedTime = Date.now();

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (position.coords.accuracy > 80) {
        document.getElementById('gpsStatus').innerText = `Refining Satellite Fix (±${Math.round(position.coords.accuracy)}m)...`;
        return;
      }

      const lat = Number(position.coords.latitude);
      const lng = Number(position.coords.longitude);
      const speed = position.coords.speed ? Number((position.coords.speed * 3.6).toFixed(1)) : 0;
      const driverLiveLatLng = new L.LatLng(lat, lng);

      // LIVE DRIVER MAP CENTERING & PIN MOVEMENT
      busMarker.setLatLng(driverLiveLatLng);
      map.panTo(driverLiveLatLng);

      if (lastRecordedLat !== null && lastRecordedLng !== null) {
        const movedDist = calculateDistanceKm(lastRecordedLat, lastRecordedLng, lat, lng);
        if (movedDist > 0.015 || speed >= 2) {
          lastMovedTime = Date.now();
        }
      }

      lastRecordedLat = lat;
      lastRecordedLng = lng;

      const distanceKm = calculateDistanceKm(lat, lng, IUST_LAT, IUST_LNG);
      const inMorningWindow = isMorningInboundWindow();

      let driverDisplayEta = "--";
      if (inMorningWindow) {
        const etaMinutes = computeMorningEtaMinutes(distanceKm, speed);
        driverDisplayEta = `~${etaMinutes} mins (${distanceKm.toFixed(1)} km to IUST)`;
      } else {
        driverDisplayEta = `Outbound Transit (${distanceKm.toFixed(1)} km from IUST)`;
      }

      db.ref('buses/' + busId).set({
        lat: lat,
        lng: lng,
        accuracy: Math.round(position.coords.accuracy),
        speed: speed,
        isOnline: true,
        lastMovedTimestamp: lastMovedTime,
        timestamp: Date.now()
      });

      document.getElementById('gpsStatus').innerText = `Satellite Fixed (±${Math.round(position.coords.accuracy)}m) ✅`;
      document.getElementById('driverEta').innerText = driverDisplayEta;
      document.getElementById('cloudStatus').innerText = "Live Synchronized 🛰️";
      document.getElementById('driverCoords').innerText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      busMarker.getPopup().setContent(`<b>My Assigned Bus (#${busId})</b><br>Live Speed: ${speed} km/h<br>${driverDisplayEta}`);
    },
    (error) => {
      document.getElementById('gpsStatus').innerText = `GPS Error: ${error.message}`;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 12000
    }
  );
}

function stopDriverTracking() {
  const busId = normalizeBusId(lockedDriverBusId);

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  // Preserves last punch-out location in Firebase RTDB
  db.ref('buses/' + busId).update({
    isOnline: false,
    speed: 0,
    timestamp: Date.now()
  });

  document.getElementById('gpsStatus').innerText = "Trip Concluded / In Yard";
  document.getElementById('driverEta').innerText = "Trip Ended";
  document.getElementById('cloudStatus').innerText = "Broadcast Ended (Last Location Preserved)";
  document.getElementById('startTripBtn').classList.remove('hidden');
  document.getElementById('stopTripBtn').classList.add('hidden');
}

// --- 8. ULTRA-FAST ZERO-LAG AUDIO & TRANSIT LAUNCH CONTROLLER ---
let isTransitAppUnlocked = false;
const mobileSound = new Audio('boot.mp3');
mobileSound.preload = 'auto';

function unlockAndStartTransit(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (isTransitAppUnlocked) return;
  isTransitAppUnlocked = true;

  // Direct synchronous audio creation on touch (Plays unmuted on iOS Safari & Android Chrome)
  try {
    mobileSound.volume = 1.0;
    mobileSound.muted = false;
    mobileSound.currentTime = 0;
    const playPromise = mobileSound.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  } catch (err) {}

  const fillBar = document.getElementById('splashLoaderFill');
  const tapBtn = document.getElementById('splashTapBtn');
  if (fillBar) fillBar.classList.add('running');
  if (tapBtn) {
    tapBtn.innerText = "⚡ Connected. Launching...";
    tapBtn.style.animation = "none";
    tapBtn.style.opacity = "0.9";
  }

  // Rapid 1.2-second smooth dismissal
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
      }, 400);
    }
  }, 1200);
}

window.addEventListener('resize', () => {
  if (typeof map !== 'undefined' && map) {
    map.invalidateSize();
  }
});

checkSecurityLockout();
initOccupancyListener();