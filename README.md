# IUST Transit Portal 🚍📍

An intelligent, real-time campus fleet tracking and telemetry portal designed for the **Islamic University of Science & Technology (IUST), Awantipora**. 

The system provides live satellite telemetry, accurate morning inbound ETA calculations, traffic halt detection, and dedicated driver-to-student synchronization across 44+ campus routes.

---

## 🚀 Key Features

* **Live Satellite Telemetry:** Real-time OpenStreetMap/Leaflet integration streaming vehicle GPS coordinates with high-precision satellite accuracy gates.
* **Driver Transponder Console:** Allows authorized fleet drivers to broadcast live speed, heading, and GPS coordinates directly from their device, with real-time map centering.
* **Ghost-Marker Glitch Shield:** Automatically terminates and detaches old database listeners when users switch routes to ensure instantaneous rendering without cross-talk.
* **Smart Commute ETA:** Automated morning-window (7:30 AM – 10:00 AM) inbound Awantipora campus ETA calculations based on live speed and distance.
* **Automated Halt Detection:** Live alert banners notifying students if a bus remains stationary for over 60 seconds due to traffic congestion or scheduled halts.
* **Security & Access Control:** Silent credential verification for IUST student registration IDs (`IUST01...`) and faculty IDs, paired with a 30-minute security lockout after consecutive unauthorized attempts.
* **Zero-Latency Mobile Audio Engine:** Native HTML5 audio integration synchronized with an interactive radar splash screen for both mobile and desktop browsers.
* **Progressive Web App (PWA) Ready:** Configured with `manifest.json` and high-resolution icons for home screen installation.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Responsive Viewport Architecture), JavaScript (ES6+)
* **Mapping Engine:** [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles
* **Backend / Database:** [Firebase Realtime Database](https://firebase.google.com/)
* **Authentication:** Firebase Auth (Email/Password & Google Sign-In)
* **Hosting:** Firebase Hosting

---

## 📁 Project Structure

```text
├── .gitignore              # Files and directories ignored by Git
├── app.js                  # Core application logic, GPS engine, and Firebase listeners
├── bus-fleet.jpg           # Campus yard illustration asset
├── boot.mp3                # Welcome telemetry audio file
├── firebase.json           # Firebase Hosting configuration
├── index.html              # Main single-page application entry point
├── iust-logo.png           # University official emblem
├── manifest.json           # PWA Web App manifest
├── README.md               # Project documentation
└── style.css               # Mobile-first stylesheet with GPU hardware acceleration