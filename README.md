<div align="center">
# MedRoute AI
 
### Autonomous Biomedical Waste Command & Segregation Platform
 
*Smarter waste management. Safer hospitals. Sustainable healthcare.*
 
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Deployment](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=black)
![Status](https://img.shields.io/badge/Status-Simulation%20Prototype-blue)
 
</div>
---
 
## Table of Contents
 
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Waste Classification Reference](#waste-classification-reference)
- [Digital Waste Passport](#digital-waste-passport)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Prototype Disclaimer](#prototype-disclaimer)
- [Roadmap](#roadmap)
- [Author](#author)
---
 
## Overview
 
**MedRoute AI** is a hospital-focused command-and-control platform that demonstrates how Edge AI, Autonomous Mobile Robots (AMRs), and digital traceability can improve biomedical waste collection, segregation, and operational safety.
 
Administrators get a single dashboard to monitor waste generation, supervise a robot fleet, dispatch collection tasks, check segregation compliance, and follow every waste batch from generation to disposal.
 
> This is a **simulation prototype**. See the [disclaimer](#prototype-disclaimer).
 
<!-- Add screenshots here:
![Dashboard](docs/screenshots/dashboard.png)
-->
 
## Problem Statement
 
| Challenge | Impact |
| --- | --- |
| **Biohazard exposure** | Manual collection risks needle-stick injuries and infection exposure |
| **Segregation errors** | Wrong categorisation contaminates recyclables and creates compliance issues |
| **Inefficient collection** | Fixed schedules cause unnecessary trips or delayed removal |
| **Limited visibility** | No centralised view of collection and segregation activity |
| **Traceability gaps** | Paper records make movement and disposal histories unreliable |
 
## Solution
 
MedRoute AI combines the following into one control centre:
 
1. AI-assisted waste classification
2. AMR fleet supervision
3. Hospital floor mapping and route visualisation
4. Dynamic collection task dispatch
5. Multi-compartment segregation monitoring
6. Digital Waste Passport generation
7. End-to-end chain-of-custody tracking
8. Analytics and compliance reporting
## Key Features
 
### Command & Control Dashboard
- Daily waste collection metrics and segregation compliance score
- Active and available robot counts, pending collection orders
- Fleet status and real-time operational audit logs
### AMR Fleet Management
- Per-robot battery, payload weight, and navigation state (Idle, En Route, Collecting, Returning)
- Motor current and Wi-Fi signal diagnostics
- Simulated LiDAR SLAM and stereo camera monitoring
- Multi-compartment payload status
- Individual and global **Emergency Stop**
### Live Hospital Floor Tracking
- Interactive SVG floor plans with multi-floor navigation
- Active robot paths, SLAM trajectory waypoints, and obstacle-avoidance detour simulation
- Department and room status highlighting
### AI Waste Classification
- Image-based classification interface with preset samples and custom upload
- Confidence score visualisation with low-confidence warning below 80%
- Automatic segregation (bin) recommendations
### Biomedical Waste Registry
- Unique Waste ID, category, originating department, timestamp, weight, and status
- Search, category filters, and **CSV export**
### Dynamic Task Dispatch
- Create tasks, set priority, pick department and floor
- Dispatch available robots, monitor execution, release robots on completion
### Operational Analytics
- Waste generation trends, category distribution, and department-wise generation
- AMR utilisation and task completion rates
- Compartment fill levels with configurable overfill thresholds
- CSV report generation
### Safety, Alerts & Settings
- Critical, Warning, and Info alerts with audio feedback (Web Audio API)
- Hospital identity settings, simulation speed controls, and Emergency Stop overrides
## Waste Classification Reference
 
| Waste Category | Suggested Bin |
| --- | --- |
| Infectious | Yellow |
| Sharps | White Translucent |
| Anatomical | Yellow |
| Cytotoxic | Yellow |
| General | General waste stream |
| Contaminated recyclable plastic | Red |
| Glassware | Blue |
 
## Digital Waste Passport
 
Every waste batch receives:
 
- A unique Waste ID (`MW-2026-XXXXXX`)
- A SHA-256 verification hash and QR-based verification code
- Category, origin, collection and transfer details
- A chronological custody history
```
Waste Generation → AI Identification → AMR Assignment → Waste Collection
        → Vault Transfer → Final Disposal → Digital Audit Record
```
 
## Tech Stack
 
| Technology | Purpose |
| --- | --- |
| React 19 | Frontend application |
| Vite 8 | Dev server and build tooling |
| JavaScript (ES6+) | Application logic |
| Vanilla CSS | Styling and responsive UI |
| Lucide React | Icons |
| React Context API | Global state management |
| Web Audio API | Audio alerts |
| SVG | Interactive floor visualisation |
| Render | Static site deployment |
 
## System Architecture
 
```
            Hospital Administrator
                     │
                     ▼
            React App (Vite)
   ┌──────────┬──────┴──────┬──────────────┐
   ▼          ▼             ▼              ▼
Dashboard  AMR Fleet   AI Scanner   Floor Tracking / Analytics
   └──────────┴──────┬──────┴──────────────┘
                     ▼
             React Context API
                     ▼
             Central State Store
        (Fleet · Waste · Task data)
                     ▼
            Simulation Engine
                     ▼
            Live UI Telemetry
```
 
## Project Structure
 
```
MedRoute/
├── public/                  # Static assets and web manifest
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/          # Header, Sidebar, App shell
│   │   └── views/           # Dashboard, Fleet, Tracking, AI Scanner, Registry, Tasks
│   ├── context/
│   │   └── AppContext.jsx   # Global state
│   ├── data/
│   │   └── mockData.js      # Seed data
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── render.yaml              # Render deployment config
└── vite.config.js
```
 
## Getting Started
 
### Prerequisites
 
- Node.js 18+
- npm 9+
- Git
### Run locally
 
```bash
git clone https://github.com/Mohit-Sable/MedRoute.git
cd MedRoute
npm install
npm run dev
```
 
Open **http://localhost:5173**.
 
### Build and preview
 
```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```
 
## Deployment
 
MedRoute AI deploys as a **Render Static Site**.
 
**Blueprint:** Render Dashboard → *New Blueprint Instance* → connect this repo → Render detects `render.yaml` → *Apply*.
 
**Manual settings:**
 
| Setting | Value |
| --- | --- |
| Service type | Static Site |
| Branch | `main` |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Rewrite | `/*` → `/index.html` |
 
## Prototype Disclaimer
 
MedRoute AI is a software-based field project and **operational simulation**. The following are simulated:
 
- Robot navigation, LiDAR SLAM, obstacle avoidance, battery and sensor readings
- Fleet operations and waste collection/transfer workflows
- AI classification and confidence scores (the interface is **not** connected to a validated inference model)
Real-world use would require physical AMR hardware, validated computer vision models, hospital system integrations, and regulatory verification.
 
**It must not be used as a substitute for certified biomedical waste handling procedures or safety systems.**
 
## Roadmap
 
- [ ] Integrate physical AMR hardware
- [ ] Real-time LiDAR and depth camera input
- [ ] Validated YOLO-based waste classification model
- [ ] ROS 2 navigation integration
- [ ] IoT-enabled smart bin monitoring
- [ ] Cloud-based fleet monitoring
- [ ] Hospital ERP and waste management system integration
- [ ] Blockchain-backed traceability
- [ ] Predictive collection scheduling
- [ ] Advanced compliance and environmental impact analytics
## Author
 
**Mohit Sable** · [@Mohit-Sable](https://github.com/Mohit-Sable)
 
---
 
<div align="center">
⭐ If you find this project interesting, consider giving it a star.
 
</div>
 
