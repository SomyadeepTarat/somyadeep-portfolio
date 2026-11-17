/** Resume is the source of truth. null fields deliberately remain TODO. */
export const profile = {
  name: "Somyadeep Tarat",
  role: "Computer Science Student & Developer",
  headline: "Thoughtful systems. Useful software.",
  bio: "I’m a computer science student at VIT, building across backend engineering, machine learning, and AI systems. My work explores how reliable software and grounded intelligence can turn complex problems into useful tools.",
  email: "sayantarat@gmail.com",
  phone: "+91 9811872941",
  location: null,
  github: "https://github.com/SomyadeepTarat",
  linkedin: "https://www.linkedin.com/in/somyadeep-tarat",
  site: "https://somyadeep-portfolio.vercel.app",
  resume: "/resume/Somyadeep-Tarat-Resume.pdf",
  portrait: "/assets/somyadeep-portrait.webp",
  education: {
    institution: "Vellore Institute of Technology",
    degree: "B.Tech in Computer Science and Engineering",
    location: "Vellore, India",
    dates: "Aug 2024 — May 2028",
    cgpa: "9.05",
  },
  certification: {
    name: "Oracle Cloud Infrastructure 2026 Generative AI Professional",
    topics: "Generative AI · LLMs · RAG · OCI",
    verificationUrl: null,
  },
};
export const experience = [
  {
    id: "axis",
    company: "Axis Max Life Insurance",
    shortName: "Axis Max Life",
    initials: "AX",
    role: "Software Development Intern",
    location: "Gurugram, India",
    dates: "May 2026 — Jul 2026",
    start: "2026-05",
    end: "2026-07",
    category: "Backend engineering",
    stack: ["Spring Boot", "REST APIs", "Testing"],
    highlights: [
      "Contributed to backend feature development using Spring Boot, including REST API integration, testing, and deployment support across environments.",
    ],
  },
  {
    id: "muzigal",
    company: "Muzigal Dwarka",
    shortName: "Muzigal",
    initials: "M",
    role: "Software Development Intern",
    location: "New Delhi, India",
    dates: "Oct 2025 — Mar 2026",
    start: "2025-10",
    end: "2026-03",
    category: "Product development",
    stack: ["Administrative dashboard", "Student records", "Workflow design"],
    highlights: [
      "Developed a personalized administrative dashboard for student records and entry management, improving accessibility and day-to-day operational workflows.",
    ],
  },
];
export const leadership = [
  {
    role: "Senior Core Member",
    organization: "ACM-VIT",
    description:
      "Led technical initiatives, mentored students, and coordinated workshops and events with university stakeholders.",
  },
  {
    role: "Technical Coordinator",
    organization: "graVITas",
    description:
      "Supported the planning and execution of VIT’s annual technical festival, including technical operations and participant coordination.",
  },
];
export const skills = [
  {
    category: "Languages",
    items: ["Python", "Java", "C/C++", "SQL", "JavaScript"],
  },
  {
    category: "AI & LLM Engineering",
    items: [
      "RAG",
      "LLM Orchestration",
      "LangGraph",
      "Ollama",
      "Embeddings",
      "Vector Search",
      "Prompt Engineering",
      "Structured Outputs",
      "Context Engineering",
      "Agentic Workflows",
    ],
  },
  {
    category: "Backend & Infrastructure",
    items: [
      "FastAPI",
      "Spring Boot",
      "REST APIs",
      "Qdrant",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "Git",
      "Pytest",
      "Ruff",
      "mypy",
    ],
  },
  {
    category: "Additional Exposure",
    items: [
      "llama.cpp",
      "MLX",
      "Model Quantization",
      "vLLM/SGLang Concepts",
      "Agent Memory Design",
      "LLM Evaluation",
      "CI/CD Fundamentals",
      "Scikit-learn",
      "XGBoost",
      "Pandas",
      "NumPy",
    ],
  },
];
export type Project = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  number: string;
  description: string;
  stack: string[];
  highlights: string[];
  github: string | null;
  live: string | null;
  screenshot: string | null;
};
export const projects: Project[] = [
  {
    id: "atlas",
    name: "Atlas",
    subtitle: "Modular AI Research Agent",
    category: "AI systems",
    number: "01",
    description:
      "A modular research agent that connects local language models with document retrieval to produce evidence-grounded responses.",
    stack: ["Python", "FastAPI", "LangGraph", "Ollama", "Qdrant", "Docker"],
    highlights: [
      "Architected a modular RAG-based research system with separate model, retrieval, and service layers, exposing grounded responses through typed FastAPI endpoints.",
      "Implemented document ingestion, text chunking, embeddings, vector retrieval, and context construction for evidence-grounded LLM responses, with structured Pydantic outputs and retry policies.",
      "Integrated locally served LLMs using Ollama; developed unit tests and applied static analysis and type checking to improve maintainability.",
    ],
    github: null,
    live: null,
    screenshot: null,
  },
  {
    id: "kew",
    name: "Kew",
    subtitle: "Energy Retrofit Recommendation Engine",
    category: "Applied intelligence",
    number: "02",
    description:
      "An energy retrofit engine combining deterministic simulations with clear, grounded explanations for what-if decisions.",
    stack: ["Python", "AI/ML", "Simulation", "LLMs", "REST APIs"],
    highlights: [
      "Developed a deterministic retrofit simulation approach to estimate energy savings, carbon reduction, and financial impact across individual upgrades and retrofit combinations.",
      "Designed a hybrid architecture separating numerical calculations and feasibility checks from LLM-generated explanations, enabling grounded what-if analysis and transparent recommendations.",
    ],
    github: null,
    live: null,
    screenshot: null,
  },
  {
    id: "fraudgraph",
    name: "FraudGraph AI",
    subtitle: "Graph-Based Fraud Detection",
    category: "Machine learning",
    number: "03",
    description:
      "Exploring transaction risk through the relationships between people, transactions, and the networks they form.",
    stack: ["Python", "Scikit-learn", "NetworkX", "Pandas"],
    highlights: [
      "Modeled financial transactions as sender-receiver graphs and engineered transaction, node, and network-level features for fraud classification.",
      "Built and evaluated supervised ML baselines against graph-enhanced models, analyzing the contribution of relational features to transaction risk scoring.",
    ],
    github: null,
    live: null,
    screenshot: null,
  },
];

export const copy = {
  about: {
    eyebrow: "THE PERSON BEHIND THE PROJECTS",
    intro: "A little about me",
    education: "Currently learning",
    locationTodo: "TODO: preferred location",
    contact: "Have something in mind?",
    contactBody:
      "I’d love to hear about interesting problems and thoughtful collaborations.",
  },
  projects: {
    title: "Selected projects",
    intro:
      "Three explorations in intelligence, reliability, and real-world problems.",
    screenshotTodo: "TODO: project screenshot",
    linksTodo: "TODO: repository and live demo links",
    details: "Inside the project",
  },
  experience: {
    title: "Learning by building",
    intro: "Hands-on experience turning technical ideas into working software.",
    leadership: "Beyond the internship",
  },
  resume: {
    title: "The one-page overview",
    description: "Education, experience, projects, and skills — in one place.",
    note: "The supplied PDF includes placeholder GitHub and portfolio URLs. TODO: replace those links in the source resume.",
    fallback:
      "Your browser may not support an embedded PDF. Open the resume in a new tab or download it below.",
  },
};
