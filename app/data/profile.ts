/** Profile from the supplied resume; project sources documented in docs/project-sources.md. */
export const profile = {
  name: "Somyadeep Tarat",
  role: "Computer Science Student & Developer",
  headline: "Thoughtful systems. Useful software.",
  bio: "I’m a computer science student at VIT, building across backend engineering, machine learning, and AI systems. My work explores how reliable software and grounded intelligence can turn complex problems into useful tools.",
  email: "sayantarat@gmail.com",
  phone: "+91 9811872941",
  location: "New Delhi",
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
  screenshots?: { src: string; alt: string }[];
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
    github: "https://github.com/SomyadeepTarat/Atlas",
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
    github: "https://github.com/SomyadeepTarat/Megathon",
    live: null,
    screenshot: null,
  },
  {
    id: "fraudgraph",
    name: "FraudDetectAI",
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
    github: "https://github.com/SomyadeepTarat/FraudDetectAI",
    live: null,
    screenshot: null,
  },
  {
    id: "brokestox",
    name: "BrokeStox",
    subtitle: "Agent-based market simulation",
    category: "Simulation",
    number: "04",
    description:
      "An interactive market simulator for exploring trades, agent behavior, and buyer–seller negotiation.",
    stack: ["Python", "FastAPI", "Next.js", "TypeScript"],
    highlights: [
      "Validates trades against agent roles, cash, and inventory.",
      "Provides step-by-step market exploration, trade history, and agent inspection.",
      "Models offers, counteroffers, acceptance, and rejection with negotiation replay.",
    ],
    github: "https://github.com/SomyadeepTarat/BrokeStox",
    live: null,
    screenshot: null,
  },
  {
    id: "kairo",
    name: "Kairo",
    subtitle: "Local-first agent execution",
    category: "AI infrastructure",
    number: "05",
    description:
      "An inspectable execution harness with a custom asynchronous kernel, typed workspace tools, and persistent run history.",
    stack: ["Python", "PostgreSQL", "FastAPI", "Alembic"],
    highlights: [
      "Persists execution events and tool records in PostgreSQL.",
      "Exposes a read-only API for inspecting runs and their history.",
      "Current demos use a scripted model; live inference and recovery are future milestones.",
    ],
    github: "https://github.com/SomyadeepTarat/Kairo",
    live: null,
    screenshot: null,
  },
  {
    id: "netguard",
    name: "NetGuard",
    subtitle: "Evidence-aware network observatory",
    category: "Network security",
    number: "06",
    description:
      "A passive network observatory that connects traffic analysis with explainable threat evidence and observation-quality checks.",
    stack: ["Python", "FastAPI", "React", "TypeScript", "SQLite"],
    highlights: [
      "Combines rules, a calibrated SVM, and novelty detection with capture-quality telemetry.",
      "Replays packet captures under controlled observation loss to study detection robustness.",
      "Tracks evidence lineage with append-only hash chains and exports investigation reports.",
    ],
    github: "https://github.com/SomyadeepTarat/NetGuard",
    live: null,
    screenshot: null,
  },
  {
    id: "hex",
    name: "Hex",
    subtitle: "Connected hospital planning",
    category: "Applied intelligence",
    number: "07",
    description:
      "A synthetic hospital-network demo connecting patient service matching, reported availability, and capacity planning.",
    stack: ["Python", "SQLite", "Machine learning"],
    highlights: [
      "Matches requested services with current hospital reports and explains alternatives.",
      "Uses ridge autoregression to forecast next-day admissions on synthetic demand data.",
      "Previews and audits planning changes with role checks and constrained resource allocation.",
    ],
    github: "https://github.com/SomyadeepTarat/Hex",
    live: null,
    screenshot: null,
  },
  {
    id: "research",
    name: "Research Project",
    subtitle: "ClaimAudit · scientific claim verification",
    category: "Research",
    number: "08",
    description:
      "A research prototype comparing embedding similarity, natural language inference, and structural checks for scientific claims.",
    stack: ["Python", "PyTorch", "Transformers", "Streamlit"],
    highlights: [
      "Checks numerical values and comparison directions against supplied evidence.",
      "Evaluates three methods and ablations on 300 grouped synthetic examples.",
      "Offers evidence-linked explanations and saved-result exploration; real-paper validation remains future work.",
    ],
    github: "https://github.com/SomyadeepTarat/ResearchProject",
    live: null,
    screenshot: null,
  },
  {
    id: "stocker",
    name: "Stocker",
    subtitle: "Price signals meet financial news",
    category: "Machine learning",
    number: "09",
    description:
      "An educational ML pipeline combining price indicators and financial news to classify short-term stock movement.",
    stack: ["Python", "XGBoost", "FastAPI", "Streamlit", "Docker"],
    highlights: [
      "Combines technical indicators, sentiment, and TF-IDF text features.",
      "Uses time-based data splits to compare baseline classifiers with XGBoost.",
      "Serves predictions and explanations through FastAPI and a Streamlit dashboard.",
    ],
    github: "https://github.com/SomyadeepTarat/Stocker",
    live: null,
    screenshot: null,
  },
];

export const featuredProjectIds = ["atlas", "kew", "fraudgraph"];

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
      "From research agents to useful tools. A collection of things I’ve built.",
    screenshotTodo: "TODO: project screenshot",
    linksTodo: "TODO: repository and live demo links",
    details: "Inside the project",
  },
  experience: {
    title: "Learning by building",
    intro: "Hands-on experience turning technical ideas into working software.",
    leadership: "Beyond the internships",
  },
  resume: {
    title: "The one-page overview",
    description: "Education, experience, projects, and skills — in one place.",
    note: "The supplied PDF includes placeholder GitHub and portfolio URLs. TODO: replace those links in the source resume.",
    fallback:
      "Your browser may not support an embedded PDF. Open the resume in a new tab or download it below.",
  },
};
