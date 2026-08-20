/**
 * Initial Seed Data for Bereket Woldemariyam Portfolio
 */

const initialProfile = {
  name: "Bereket Woldemariyam",
  title: "Full-Stack Web Developer",
  summary: "Passionate Full-Stack Web Developer with a background in Civil Engineering, focused on building responsive web applications, RESTful APIs, and modern digital experiences.",
  detailedBio: "With a rigorous background in Civil Engineering, I bring analytical problem-solving, structural precision, and architectural discipline to modern software development. I specialize in building responsive, scalable full-stack web applications with Node.js, Express, React, and MongoDB, crafting clean code and intuitive user interfaces.",
  location: "Addis Ababa, Ethiopia",
  email: "bereket2114@gmail.com",
  github: "https://github.com/bereket2114",
  githubUsername: "bereket2114",
  linkedin: "https://linkedin.com/in/bereket-woldemariyam",
  yearsOfEngineering: "3+",
  disciplines: ["Structural Analysis", "Full-Stack Web Architecture", "RESTful Systems", "UI/UX Engineering"]
};

const initialSkills = [
  {
    id: "skill-js",
    name: "JavaScript (ES6+)",
    category: "Frontend",
    level: "Advanced",
    icon: "javascript",
    description: "Modern asynchronous JS, Closures, DOM Manipulation, Promises, Event Loop",
    order: 1
  },
  {
    id: "skill-node",
    name: "Node.js",
    category: "Backend",
    level: "Advanced",
    icon: "nodejs",
    description: "Server runtime, Event-driven architecture, File system, Async I/O, npm ecosystem",
    order: 2
  },
  {
    id: "skill-express",
    name: "Express.js",
    category: "Backend",
    level: "Advanced",
    icon: "express",
    description: "Middleware pipelines, RESTful routing, Authentication, Error handling",
    order: 3
  },
  {
    id: "skill-react",
    name: "React.js",
    category: "Frontend",
    level: "Intermediate",
    icon: "react",
    description: "Component architecture, Hooks, State management, SPA routing, Virtual DOM",
    order: 4
  },
  {
    id: "skill-ejs",
    name: "EJS",
    category: "Frontend",
    level: "Advanced",
    icon: "ejs",
    description: "Server-side template rendering, dynamic partials, data-binding in Express",
    order: 5
  },
  {
    id: "skill-mongodb",
    name: "MongoDB",
    category: "Database",
    level: "Intermediate",
    icon: "mongodb",
    description: "NoSQL schema design, Mongoose ORM, Aggregations, CRUD operations",
    order: 6
  },
  {
    id: "skill-tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    level: "Advanced",
    icon: "tailwind",
    description: "Utility-first responsive design, Dark mode, Custom design tokens, Flexbox/Grid",
    order: 7
  },
  {
    id: "skill-html5",
    name: "HTML5",
    category: "Frontend",
    level: "Advanced",
    icon: "html5",
    description: "Semantic web structure, Modern forms, Accessibility (a11y), SEO standards",
    order: 8
  },
  {
    id: "skill-css3",
    name: "CSS3",
    category: "Frontend",
    level: "Advanced",
    icon: "css3",
    description: "Animations, Glassmorphism, Responsive media queries, Custom properties",
    order: 9
  },
  {
    id: "skill-git",
    name: "Git",
    category: "Tools & DevOps",
    level: "Advanced",
    icon: "git",
    description: "Version control, Branching strategies, Merging, Rebase, Conflict resolution",
    order: 10
  },
  {
    id: "skill-github",
    name: "GitHub",
    category: "Tools & DevOps",
    level: "Advanced",
    icon: "github",
    description: "Collaborative workflows, Pull Requests, Code reviews, GitHub Actions, Pages",
    order: 11
  },
  {
    id: "skill-rest",
    name: "REST APIs",
    category: "Backend",
    level: "Advanced",
    icon: "api",
    description: "API design, HTTP methods, Status codes, JSON payloads, Integration & Postman",
    order: 12
  }
];

const initialProjects = [
  {
    id: "proj-1320271907",
    githubId: 1320271907,
    name: "TaskFlow",
    title: "TaskFlow - Productivity & Task Management Web App",
    description: "A sleek personal productivity web application designed to manage daily tasks, track sprint progress, and turn priorities into steady progress with responsive layouts and persistent state.",
    language: "EJS",
    tags: ["Node.js", "Express.js", "EJS", "Tailwind CSS", "REST API", "MVC"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/TaskFlow",
    homepage: "https://task-flow-ruddy-zeta.vercel.app",
    featured: true,
    category: "Full-Stack",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  },
  {
    id: "proj-1329756396",
    githubId: 1329756396,
    name: "Findly",
    title: "Findly - Search & Discovery Web Platform",
    description: "An intuitive web application for searching, discovering, and categorizing resources with real-time feedback, responsive UI cards, and clean server-rendered templates.",
    language: "EJS",
    tags: ["Node.js", "Express.js", "EJS", "JavaScript", "REST APIs"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/Findly",
    homepage: "https://findly-sepia.vercel.app",
    featured: true,
    category: "Full-Stack",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  },
  {
    id: "proj-1245928320",
    githubId: 1245928320,
    name: "NASA-Library",
    title: "NASA Astronomy & Media Library Explorer",
    description: "Interactive astronomy image and astrophysics archive explorer consuming NASA's Open APIs to bring stunning cosmic imagery and scientific explanations to users.",
    language: "JavaScript",
    tags: ["JavaScript", "REST APIs", "NASA Open API", "CSS3", "Responsive Design"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/NASA-Library",
    homepage: "https://nasa-library.vercel.app",
    featured: true,
    category: "Frontend",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  },
  {
    id: "proj-1340537319",
    githubId: 1340537319,
    name: "Rock-Paper-Scissor_GAME",
    title: "Rock Paper Scissors Interactive Game",
    description: "An animated, responsive game featuring dynamic computer choice logic, score tracking, interactive sound/visual feedback, and smooth state updates.",
    language: "JavaScript",
    tags: ["JavaScript", "DOM Manipulation", "CSS Animations", "Game Logic"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/Rock-Paper-Scissor_GAME",
    homepage: "https://rock-paper-scissor-game-jade-chi.vercel.app",
    featured: false,
    category: "Games & Tools",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  },
  {
    id: "proj-1276243661",
    githubId: 1276243661,
    name: "Hossana-Gofer-Meda-MKC",
    title: "Hossana Gofer Meda MKC Community Portal",
    description: "A community portal and landing page built with modern responsive styling, event schedules, multimedia showcase, and accessible navigation.",
    language: "CSS",
    tags: ["HTML5", "CSS3", "Responsive UI", "Web Performance"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/Hossana-Gofer-Meda-MKC",
    homepage: "https://hossana-gofer-meda-mkc.vercel.app",
    featured: false,
    category: "Frontend",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  },
  {
    id: "proj-1270203109",
    githubId: 1270203109,
    name: "playCard_Game",
    title: "Card Game Deck Simulator & Engine",
    description: "An interactive card game application exploring deck shuffling algorithms, turn-based mechanics, and real-time score keeping.",
    language: "JavaScript",
    tags: ["JavaScript", "ES6+", "Algorithms", "DOM Manipulation"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/playCard_Game",
    homepage: "",
    featured: false,
    category: "Games & Tools",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  },
  {
    id: "proj-1242498422",
    githubId: 1242498422,
    name: "rappersName",
    title: "Artist & Rapper Name Generator / API",
    description: "Lightweight Node/JavaScript application generating creative aliases and serving structured artist metadata through an intuitive endpoint.",
    language: "JavaScript",
    tags: ["JavaScript", "Node.js", "Express.js", "API Design"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/rappersName",
    homepage: "",
    featured: false,
    category: "Backend",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  },
  {
    id: "proj-1254253552",
    githubId: 1254253552,
    name: "codewars-solutions",
    title: "Algorithmic Challenges & Solutions",
    description: "Comprehensive repository of clean, optimized JavaScript algorithmic solutions tackling data structures, recursion, sorting, and algorithmic complexity.",
    language: "JavaScript",
    tags: ["JavaScript", "Data Structures", "Algorithms", "Problem Solving"],
    stars: 0,
    forks: 0,
    githubUrl: "https://github.com/bereket2114/codewars-solutions",
    homepage: "",
    featured: false,
    category: "Algorithms",
    updatedAt: new Date().toISOString(),
    isCustom: false,
    hidden: false
  }
];

module.exports = {
  initialProfile,
  initialSkills,
  initialProjects
};
