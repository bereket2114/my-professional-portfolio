# 🌐 Bereket Woldemariyam — Dynamic Full-Stack Portfolio

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21+-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A modern, high-performance, dynamic portfolio web application built with **Node.js, Express, Tailwind CSS, and Vanilla JavaScript**. Featuring **live GitHub repository synchronization**, full **CRUD management** for skills & projects, a unique **Civil Engineering Spotlight**, and a **Dual-Engine Storage Architecture** (seamless auto-switching between MongoDB Atlas and local JSON storage).

---

## ✨ Features

- **🚀 Dynamic Hero Section**: Real-time availability status badge, animated tech tags, quick statistics, social links, and direct CV/Resume download.
- **🔄 Live GitHub Sync**: Fetches and synchronizes public repositories in real time using the GitHub REST API, calculating live stargazers, forks, and primary languages.
- **🛠️ Interactive Skills Matrix**: Categorized skill management (Frontend, Backend, Database, Tools, Engineering) with proficiency indicators and dynamic CRUD modal operations.
- **📂 Dynamic Project Showcase**: Filter projects by category (All, Full-Stack, Frontend, Backend, Engineering), view live demos, source code, and add custom projects.
- **🌉 Civil Engineering Spotlight**: Highlights analytical problem-solving, structural design thinking, and computational modeling applied to modern software engineering.
- **💾 Dual-Engine Storage Architecture**:
  - **MongoDB Mode**: Automatically connects when `MONGODB_URI` is supplied and seeds default collections if empty.
  - **Zero-Config JSON Mode**: Automatically falls back to atomic local JSON storage (`/data/*.json`) when no database is configured.
- **🌓 Dark & Light Mode**: Persistent theme switching with system preference detection and smooth glassmorphism styling.
- **📨 Interactive Contact Form**: Responsive form with validation, async API submission, and animated toast feedback.
- **⚡ Vercel Serverless Ready**: Configured with `vercel.json` for one-click deployment.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, Tailwind CSS, Custom Glassmorphism CSS, Vanilla ES6+ JavaScript, FontAwesome Icons |
| **Backend** | Node.js, Express.js, CORS, Morgan Logger, Dotenv |
| **Storage / Database** | Mongoose (MongoDB ODM) with automatic fallback to Atomic Local JSON Storage |
| **APIs** | GitHub REST API v3, Custom RESTful CRUD endpoints |
| **Deployment** | Vercel Serverless Functions (`@vercel/node`), Node.js standalone |

---

## 📁 Project Structure

```
bereket-portfolio/
├── data/                       # Local JSON storage fallback (auto-created)
│   ├── profile.json
│   ├── projects.json
│   └── skills.json
├── public/                     # Static frontend assets
│   ├── css/
│   │   └── style.css           # Glassmorphic UI & custom animations
│   ├── js/
│   │   ├── app.js              # State management & dynamic UI rendering
│   │   ├── modals.js           # CRUD modal forms & validation
│   │   └── theme.js            # Dark/light mode theme controller
│   └── index.html              # Semantic single-page application layout
├── src/                        # Backend source code
│   ├── config/
│   │   └── db.js               # MongoDB connection manager with fail-safe fallback
│   ├── models/
│   │   ├── Profile.js          # Mongoose Profile schema
│   │   ├── Project.js          # Mongoose Project schema
│   │   └── Skill.js            # Mongoose Skill schema
│   ├── routes/
│   │   └── api.js              # RESTful API route definitions
│   ├── services/
│   │   └── githubService.js    # GitHub REST API sync & caching logic
│   └── storage/
│       ├── dataManager.js      # Unified storage abstraction (Mongo/JSON)
│       ├── initialData.js      # Default portfolio seed data
│       └── jsonStorage.js      # Atomic JSON file I/O operations
├── .env.example                # Example environment configuration
├── package.json                # Project dependencies & npm scripts
├── server.js                   # Express application entry point & serverless export
├── test-verify.js              # Comprehensive test & verification suite
└── vercel.json                 # Vercel deployment configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- *(Optional)* [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/bereket2114/bereket-portfolio.git
cd bereket-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` template:

```bash
cp .env.example .env
```

Edit `.env` with your desired configuration:

```env
PORT=3000

# Optional: MongoDB Connection String
# Leave blank to use zero-config local JSON file storage
MONGODB_URI=

# GitHub username to fetch public repositories from
GITHUB_USERNAME=bereket2114
```

### 4. Run the Application

```bash
# Start in production mode
npm start

# Or start with auto-reload (development mode)
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System health check, storage mode, and server uptime |
| `GET` | `/api/status` | Current API status and active storage engine (`MongoDB` or `JSON Storage`) |
| `GET` | `/api/profile` | Retrieve profile information, biography, and statistics |
| `PUT` | `/api/profile` | Update profile information |
| `GET` | `/api/skills` | Retrieve all skills grouped or listed |
| `POST` | `/api/skills` | Add a new skill |
| `PUT` | `/api/skills/:id` | Update an existing skill |
| `DELETE` | `/api/skills/:id` | Delete a skill |
| `POST` | `/api/skills/reset` | Restore skills to initial default seed |
| `GET` | `/api/projects` | Retrieve all projects |
| `POST` | `/api/projects` | Add a custom project |
| `PUT` | `/api/projects/:id` | Update project details or tags |
| `DELETE` | `/api/projects/:id` | Remove a project |
| `POST` | `/api/projects/sync-github` | Trigger live synchronization with GitHub API |
| `POST` | `/api/projects/reset` | Restore projects to initial default seed |
| `POST` | `/api/contact` | Submit a message through the contact form |

---

## 🧪 Testing & Verification

Run the automated verification suite to test all API endpoints, database synchronization, and UI components:

```bash
node test-verify.js
```

---

## ☁️ Deployment to Vercel

This repository includes a pre-configured `vercel.json` file.

### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview build
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy with Git Integration

1. Push your code to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
3. Select your repository and import it.
4. Under **Environment Variables**, optionally set:
   - `MONGODB_URI` — *(Optional)* MongoDB connection URI
   - `GITHUB_USERNAME` — `bereket2114`
5. Click **Deploy**.

---

## 👤 Author

**Bereket Woldemariyam**
- **Role**: Full-Stack Web Developer & Civil Engineer
- **GitHub**: [@bereket2114](https://github.com/bereket2114)
- **LinkedIn**: [linkedin.com/in/bereket-woldemariyam-61377b437](https://www.linkedin.com/in/bereket-woldemariyam-61377b437)
- **Email**: [bereketwoldemariam369@gmail.com](mailto:bereketwoldemariam369@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
