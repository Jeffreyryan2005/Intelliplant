<div align="center">
  <img src="assets/hero.png" alt="IntelliPlant Hero" width="100%" />
  
  # IntelliPlant
  **AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain**
  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a>
  </p>
</div>

---

## 🏆 ET AI Hackathon 2.0 Submission

**Problem Statement 8:** *AI for Industrial Knowledge Intelligence*

IntelliPlant is a comprehensive AI-powered knowledge engine designed specifically for petrochemical plants and heavy industrial environments. It ingests vast amounts of unstructured engineering documentation (SOPs, P&IDs, maintenance logs, inspection reports) and transforms them into an intelligent, unified operations brain.

Built for the demanding environments of modern refineries, IntelliPlant guarantees real-time contextual awareness, instantly resolving complex technical queries and drastically reducing operational downtime.

---

## ✨ Features

- **🧠 Knowledge Copilot (RAG):** Ask complex engineering questions like *"What is the standard procedure for CDU pump failure?"* and get instant, cited answers directly extracted from your P&IDs and SOPs. Powered by Groq's blazing fast `llama-3.3-70b-versatile` model.
- **🕸️ Dynamic Knowledge Graph:** Visualise the intricate relationships between equipment, failure modes, chemicals, and compliance regulations. Explore dependencies to pinpoint root causes of failure.
- **⚡ Real-Time Asset Monitoring Dashboard:** Monitor documents ingested, knowledge entities extracted, active equipment status, and overall compliance scores in a stunning, fully-responsive dashboard.
- **📱 Fully Responsive Design:** Sleek, glassmorphism UI optimized for tablet and mobile devices, ensuring field engineers have the knowledge brain right in their pockets.
- **🔋 Zero-Dependency Vector Search:** Built using a highly optimized Scikit-Learn TF-IDF vectorizer, meaning zero C++ build requirements, making it 100% portable and deployable anywhere (Vercel, Render, AWS).

---

## 🏗️ Architecture

IntelliPlant utilizes a decoupled modern architecture:

1.  **Frontend (Next.js):** A premium UI featuring Framer Motion for smooth animations, Recharts for analytics, and react-force-graph-2d for the dynamic knowledge graph. It connects to the backend via stateless REST APIs.
2.  **Backend (FastAPI):** A high-performance Python backend that handles document ingestion (PyMuPDF), knowledge graph construction (NetworkX), and vector search (Scikit-Learn).
3.  **LLM Layer (Groq):** Utilizing Groq's LPU inference engine for near-instantaneous language processing.

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Force Graph](https://github.com/vasturiano/react-force-graph)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/)
- [NetworkX](https://networkx.org/) (Knowledge Graph)
- [Scikit-Learn](https://scikit-learn.org/) (Vector RAG Search)
- [Groq AI](https://groq.com/) (LLM)
- [PyMuPDF](https://pymupdf.readthedocs.io/) (Document parsing)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Groq API Key

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Generate Sample Data:**
To pre-populate the dashboard with realistic data, run the document generation and ingestion pipeline:
```bash
python scripts/generate_sample_docs.py
python scripts/preload_docs.py
```

**Run Backend Server:**
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Run Frontend Server:**
```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the IntelliPlant dashboard!

---

<div align="center">
  <i>Built to win the ET AI Hackathon 2.0</i>
</div>
