# MedRoute AI
### Autonomous Biomedical Waste Command & Segregation Platform

<p align="center">
  An intelligent hospital waste management platform integrating Edge AI, Autonomous Mobile Robotics, and digital waste traceability to improve biomedical waste collection, segregation, and operational safety.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/AI-Computer%20Vision-8A2BE2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" />
</p>

---

## Overview

**MedRoute AI** is a hospital-focused biomedical waste management and command-and-control platform designed to demonstrate how intelligent automation can improve healthcare waste collection, segregation, and regulatory traceability.

Hospitals generate different categories of biomedical waste every day. Improper handling and segregation can expose healthcare workers to hazardous materials, increase operational costs, and create compliance challenges.

MedRoute AI addresses these challenges through a centralized digital platform that simulates the supervision of Autonomous Mobile Robots (AMRs), AI-powered waste classification, multi-compartment waste collection, and digital chain-of-custody tracking.

The platform provides hospital administrators with a unified operational dashboard to monitor waste generation, robot fleets, collection tasks, segregation compliance, and waste movement across hospital departments.

## Problem Statement

Traditional biomedical waste management systems face several operational challenges:

- **Biohazard Exposure:** Manual waste collection increases the risk of needle-stick injuries and exposure to infectious materials.
- **Segregation Errors:** Incorrect waste categorization can contaminate recyclable materials and create regulatory compliance issues.
- **Inefficient Collection:** Fixed collection schedules may result in unnecessary trips or delayed waste removal.
- **Limited Visibility:** Hospitals often lack centralized visibility into waste collection and segregation operations.
- **Traceability Gaps:** Paper-based records make it difficult to maintain reliable waste movement and disposal histories.

## Our Solution

MedRoute AI introduces an intelligent waste management control center that combines:

1. AI-assisted biomedical waste classification.
2. Autonomous Mobile Robot fleet supervision.
3. Hospital floor mapping and route visualization.
4. Dynamic waste collection task dispatch.
5. Multi-compartment waste segregation monitoring.
6. Digital Waste Passport generation.
7. End-to-end chain-of-custody tracking.
8. Operational analytics and compliance reporting.

## Key Features

### 1. Command & Control Dashboard

A centralized operational dashboard providing hospital administrators with an overview of waste management activities.

- Daily biomedical waste collection metrics.
- Segregation compliance score.
- Active and available robot count.
- Pending waste collection orders.
- Fleet status monitoring.
- Real-time operational audit logs.

### 2. Autonomous Mobile Robot (AMR) Fleet Management

Monitor and supervise the hospital's autonomous waste collection fleet.

- Individual robot status monitoring.
- Battery percentage and payload weight.
- Navigation states: Idle, En Route, Collecting, and Returning.
- Motor current and Wi-Fi signal diagnostics.
- Simulated LiDAR SLAM and stereo camera sensor monitoring.
- Multi-compartment payload status.
- Individual and global Emergency Stop controls.

### 3. Live Hospital Floor Tracking

Interactive hospital floor visualization for monitoring robot movement and collection activities.

- Interactive SVG-based hospital floor plans.
- Multi-floor navigation.
- Active robot path visualization.
- SLAM trajectory waypoints.
- Obstacle avoidance detour simulation.
- Department and room status highlighting.

### 4. AI-Powered Biomedical Waste Classification

A computer-vision-inspired classification interface designed to identify biomedical waste categories.

Supported waste categories:

| Waste Category | Suggested Bin |
|---|---|
| Infectious | Yellow |
| Sharps | White Translucent |
| Anatomical | Yellow |
| Cytotoxic | Yellow |
| General | General waste stream |
| Contaminated recyclable plastic | Red |
| Glassware | Blue |

Additional capabilities:

- Image-based waste classification interface.
- Preset biomedical waste samples.
- Custom image upload.
- Confidence score visualization.
- Low-confidence warnings below 80%.
- Automated waste segregation recommendations.

### 5. Biomedical Waste Registry

A searchable registry for monitoring biomedical waste batches.

- Unique Waste ID.
- Waste category and classification.
- Originating hospital department.
- Collection timestamp.
- Waste weight.
- Current processing status.
- Category-based filtering.
- CSV export for operational reporting.

### 6. Dynamic Task Dispatch

An intelligent task management interface for coordinating waste collection activities.

- Create collection tasks.
- Assign priority levels.
- Select hospital departments and floors.
- Dispatch available robots.
- Monitor task execution.
- Update fleet status dynamically.
- Release robots after task completion.

### 7. Operational Analytics

Visualize waste management performance through multiple analytical views.

- Waste generation trends.
- Waste distribution by category.
- Department-wise waste generation.
- AMR utilization metrics.
- Collection task completion rates.
- Compartment fill-level monitoring.
- Configurable overfill warning thresholds.
- CSV operational report generation.

### 8. Digital Waste Passport

A digital identity and traceability mechanism for every biomedical waste batch.

Each waste batch receives:

- Unique Waste ID (`MW-2026-XXXXXX`).
- SHA-256 verification hash.
- QR-based verification code.
- Waste category and origin.
- Collection and transfer information.
- Chronological custody history.

**Chain-of-custody workflow:**

```text
Waste Generation
       |
       v
AI Identification
       |
       v
AMR Assignment
       |
       v
Waste Collection
       |
       v
Vault Transfer
       |
       v
Final Disposal
       |
       v
Digital Audit Record
```

### 9. Safety, Alerts & Operational Settings

- Critical, Warning, and Information alerts.
- Interactive alert simulation.
- Audio feedback using Web Audio API.
- Configurable compartment overfill thresholds.
- Hospital identity settings.
- AMR simulation speed controls.
- Emergency Stop overrides.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend application |
| Vite 8 | Development server and build tooling |
| JavaScript ES6+ | Application logic |
| Vanilla CSS | Styling and responsive UI |
| Lucide React | Icons |
| React Context API | Global state management |
| Web Audio API | Audio alert feedback |
| SVG | Interactive hospital floor visualization |
| Render | Static site deployment |

## System Architecture

```text
              HOSPITAL ADMINISTRATOR
                       |
                       v
              REACT APPLICATION
                    (Vite)
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Dashboard    AMR Fleet    AI Scanner
          |            |            |
          v            v            v
       Analytics   Floor Tracking  Classification
          |            |            |
          +------------+------------+
                       |
                       v
               REACT CONTEXT API
                       |
                       v
               CENTRAL STATE STORE
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Fleet Data   Waste Data   Task Data
          |            |            |
          +------------+------------+
                       |
                       v
              SIMULATION ENGINE
                       |
                       v
             LIVE UI TELEMETRY
```

## Project Structure

```text
MedRoute/
│
├── public/
│   └── Static assets and web manifest
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header
│   │   │   ├── Sidebar
│   │   │   └── App Shell
│   │   │
│   │   └── views/
│   │       ├── Dashboard
│   │       ├── Fleet
│   │       ├── Tracking
│   │       ├── AI Scanner
│   │       ├── Registry
│   │       └── Tasks
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── render.yaml
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or higher.
- npm 9 or higher.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/Mohit-Sable/MedRoute.git
```

### 2. Navigate to the Project Directory

```bash
cd MedRoute
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the following URL in your browser:

```text
http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
```

The optimized production build will be generated inside the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## Deployment

MedRoute AI is configured for deployment as a Render Static Site.

### Deploy using Render Blueprint

1. Open the [Render Dashboard](https://dashboard.render.com/).
2. Select **New Blueprint Instance**.
3. Connect your GitHub repository.
4. Render will detect the `render.yaml` configuration.
5. Review the deployment settings.
6. Click Apply to deploy the application.

### Manual Deployment Configuration

| Setting | Value |
|---|---|
| Service Type | Static Site |
| Branch | main |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Rewrite Source | `/*` |
| Rewrite Destination | `/index.html` |

## Important Prototype Disclaimer

MedRoute AI is currently a software-based field project and operational simulation prototype.

The following capabilities are simulated:

- Autonomous robot navigation and movement.
- LiDAR SLAM and obstacle avoidance telemetry.
- Robot battery and sensor readings.
- Real-time fleet operations.
- AI-based waste classification and confidence scores.
- Waste collection and transfer workflows.

The computer vision interface demonstrates a classification workflow; it is not currently connected to a validated production AI inference model.

Physical AMR hardware, validated computer vision models, hospital infrastructure integrations, and regulatory verification systems would be required for real-world deployment.

**MedRoute AI should not be used as a substitute for certified biomedical waste handling procedures or safety systems.**

## Future Enhancements

- Integration with physical Autonomous Mobile Robots.
- Real-time LiDAR and depth camera integration.
- Deployment of validated YOLO-based waste classification models.
- ROS 2 integration for autonomous navigation.
- IoT-enabled waste bin monitoring.
- Cloud-based fleet monitoring.
- Hospital ERP and waste management system integration.
- Blockchain-backed waste traceability.
- Predictive waste collection scheduling.
- Advanced compliance and environmental impact analytics.

## Project Objectives

MedRoute AI aims to demonstrate how emerging technologies can improve biomedical waste management through:

- Reduced human exposure to hazardous waste.
- Improved segregation accuracy.
- Optimized collection workflows.
- Better hospital operational visibility.
- Digital waste traceability.
- Data-driven waste management decisions.

## Author

**Mohit Sable**

GitHub: [@Mohit-Sable](https://github.com/Mohit-Sable)

Project Repository: [MedRoute AI](https://github.com/Mohit-Sable/MedRoute)

---

<p align="center">
  <b>Smarter Waste Management. Safer Hospitals. Sustainable Healthcare.</b>
  <br/><br/>
  ⭐ If you find this project interesting, consider giving it a star!
</p>
