# MedRoute AI — Autonomous Biomedical Waste Command & Segregation Platform

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Field%20Project%20Prototype-blue.svg)]()
[![Deployment](https://img.shields.io/badge/Deploy-Render%20Ready-46E3B7?logo=render&logoColor=white)](render.yaml)

> **Field Project Overview**: MedRoute AI is a software prototype and mission-control platform designed for hospitals to supervise AI-powered, battery-electric Autonomous Mobile Robots (AMRs) tasked with biomedical waste collection, computer-vision identification, automated multi-compartment segregation, and end-to-end regulatory traceability.

---

## 📌 Problem Statement & Context

Modern hospital facilities produce tonnes of hazardous biomedical waste daily across Emergency Departments, Intensive Care Units, Operating Theatres, and Pathology Laboratories. Traditional collection methods suffer from:
1. **Biohazard Exposure**: Manual waste handling risks needle-stick injuries, pathogen transmission, and chemical contamination.
2. **Segregation Errors**: Improperly sorted waste (e.g., sharps mixed with general or infectious waste) violates health standards, contaminates recyclable materials, and exponentially increases incineration costs.
3. **Audit & Traceability Gaps**: Manual paper logs lack real-time chain-of-custody verification, resulting in regulatory compliance penalties.

**MedRoute AI** solves this by uniting **Edge Computer Vision**, **Autonomous Mobile Robotics (AMR)**, and a **Digital Waste Passport** ledger into an operational command center.

---

## 🚀 Key Features

### 1. 🏥 Command & Control Dashboard
- Real-time KPI telemetry: Daily waste collected (kg), segregation compliance score (%), active rovers, and pending biohazard collection orders.
- Dynamic fleet status monitor displaying robot battery levels, navigation states (`Idle`, `En Route`, `Collecting`, `Returning`), and active payload weights.
- Real-time audit log recording every automated navigation, scan, and transfer event.

### 2. 🤖 Autonomous Mobile Robot (AMR) Fleet Supervision
- Detailed rover kinematics: battery levels, motor currents, Wi-Fi RSSI signal strength, and odometer readings.
- Sensor diagnostics monitoring 2D LiDAR SLAM, dual stereo depth cameras, ultrasonic proximity arrays, and UV-C sterilization status.
- Payload monitoring across segregated multi-bin bays with individual lock and status indicators.
- One-click global and individual emergency stop (`E-Stop`) overrides.

### 3. 🗺️ Live Costmap & Hospital Floor Tracking
- Interactive SVG blueprint with dynamic floor switching (**Basement Vault**, **Floor 1 ED/Pharma**, **Floor 2 ICU/Wards**, **Floor 3 Pathology**).
- SLAM trajectory waypoints, active AMR path vectors, and costmap obstacle-avoidance detours.
- Floor-aware room highlighting for departmental status tracking.

### 4. 🔬 Edge AI Waste Classification Scanner
- Optical and depth viewfinder simulating camera feed from AMR rover arm.
- Neural classification inferring waste item category (`Infectious`, `Sharps`, `Anatomical`, `Cytotoxic`, `General`).
- Real-time confidence score metrics with safety fallback warnings for low-confidence detections (<80%).
- Automated bin recommendation (`Yellow`, `Red`, `White Translucent`, `Blue/Cardboard`).
- Support for preset test bio-waste samples and custom image file uploads (with type and 10MB size validation).

### 5. 🗂️ Biomedical Waste Registry & Filtering
- Searchable database of waste batches with categorization, originating ward, timestamp, weight, and status.
- Real-time search by Waste ID, department, or item name with category pills.
- CSV export for environmental compliance reporting.

### 6. 📋 Dynamic Task Dispatch & Queue
- Assign high-priority collection tasks by department, floor, and urgency.
- Automated robot dispatch: updating task assignments dynamically transitions rovers from `Idle` to `En Route`.
- Automatic robot release upon collection completion.

### 7. 📊 Multi-Stream Operational Analytics
- Waste generation trends by stream and department.
- AMR utilization and task completion rates.
- Compartment fill levels against customizable overfill warning thresholds.
- Instant CSV operational report generation.

### 8. 🛡️ Digital Waste Passport & Chain of Custody
- Unique regulatory Waste ID (`MW-2026-XXXXXX`) with cryptographic verification hash (`SHA-256`).
- Step-by-step custody timeline tracking: Generation $\rightarrow$ AI Identification $\rightarrow$ AMR Assignment $\rightarrow$ Collection $\rightarrow$ Vault Transfer $\rightarrow$ Final Disposal.
- Digital scannable QR verification code.

### 9. ⚠️ Safety, Alerting & Operational Settings
- Real-time alerts categorized by severity (`Critical`, `Warning`, `Info`).
- Interactive alert simulation trigger with Web Audio feedback effects.
- Configurable hospital identity, AMR clock acceleration (1x, 2x, 5x), and compartment overfill thresholds.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tooling & Bundler**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modular, high-performance Vanilla CSS with design tokens, sleek dark hospital theme, and glassmorphic panels
- **Audio Feedback**: Native Web Audio API synthesis
- **State Management**: React Context API (`AppContext.jsx`) with deterministic real-time telemetry simulation
- **Deployment Target**: [Render Static Site](https://render.com/)

---

## 📁 Repository Structure

```text
Field Project/
├── dist/                     # Optimized production bundle
├── public/                   # Static assets & web manifest
├── src/
│   ├── assets/               # Local styles and static assets
│   ├── components/
│   │   ├── layout/           # Header, Sidebar, and App Shell
│   │   └── views/            # Dashboard, Fleet, Tracking, AI Scanner, Registry, Tasks, etc.
│   ├── context/
│   │   └── AppContext.jsx    # Central state store & deterministic AMR simulation engine
│   ├── data/
│   │   └── mockData.js       # Initial state, route waypoints, demo AI samples, and analytics
│   ├── App.jsx               # Root application router & modal coordinator
│   ├── index.css             # Design tokens, typography, badges, cards, responsive layout
│   └── main.jsx              # React 19 bootstrap entry
├── .env.example              # Environment variable specification
├── render.yaml               # Infrastructure-as-Code for Render Static Site deployment
├── index.html                # HTML5 entry with metadata
├── package.json              # Project scripts and dependencies
└── README.md                 # Project documentation
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` (v9+ recommended)

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Field Project"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment (Optional)
```bash
cp .env.example .env
```

### 4. Start the development server
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://127.0.0.1:5173/
```

### 5. Build for production
```bash
npm run build
```
The compiled, minified bundle will be output to the `dist/` directory.

### 6. Preview the production build locally
```bash
npm run preview
```

---

## ☁️ Deployment on Render

This project is configured to deploy as a **Render Static Site**.

### Option A: Automatic Deploy with `render.yaml` Blueprint
1. In [Render Dashboard](https://dashboard.render.com/), navigate to **Blueprints** $\rightarrow$ **New Blueprint Instance**.
2. Connect your Git repository.
3. Render reads `render.yaml` automatically, sets up the static service, installs dependencies, runs `npm run build`, and configures the single-page application rewrite rule (`/*` $\rightarrow$ `/index.html`).
4. Click **Apply**.

### Option B: Manual Static Site Setup
1. In Render, select **New +** $\rightarrow$ **Static Site**.
2. Connect your Git repository.
3. Configure:
   - **Name**: `medroute-ai`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**, add:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Click **Create Static Site**.

---

## 🔒 Important Prototype Disclaimers

1. **Simulated Robotics & Telemetry**: MedRoute AI is a software control-room demonstration. All robot coordinate kinematics, waypoint traversal, and sensor readings are generated via deterministic state simulation.
2. **Demonstration AI Model**: The computer-vision classification simulates a MobileNet-V3 / YOLOv8 TensorRT edge model pipeline. It is not intended for real clinical diagnostic use without connection to a validated medical model service.

---

## 📄 License
This project was developed as an academic and technological field demonstration prototype. Distributed under the MIT License.
