export type Project = {
  code: string;
  name: string;
  type: string;
  text: string;
  stack: string[];
  status: "ACTIVE" | "ARCHIVED";
  year: string;
};

export const projects: Project[] = [
  { code: "01", name: "MarketMind", type: "Financial Intelligence", text: "An end-to-end ML system that forecasts next-day stock movement with confidence, feature drivers and human-readable explanations.", stack: ["Python", "XGBoost", "FastAPI", "Streamlit", "Docker"], status: "ACTIVE", year: "2026" },
  { code: "02", name: "FraudGraph AI", type: "Graph Intelligence", text: "A graph-based fraud detection system that maps sender–receiver networks, scores node and edge risk, and compares graph models with a strong baseline.", stack: ["Python", "NetworkX", "Scikit-learn", "Streamlit"], status: "ARCHIVED", year: "2025" },
  { code: "03", name: "Sunny.ai", type: "Revenue Automation", text: "An AI sponsorship pipeline for lead sourcing, research, scoring, CRM sync and personalized outreach generation.", stack: ["React", "TanStack Start", "Postgres", "Vercel AI SDK", "HubSpot"], status: "ACTIVE", year: "2026" },
];
