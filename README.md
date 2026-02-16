# OriGen: AI Weaving Pattern Generator

OriGen is a web application that combines traditional textile patterns with Generative AI. It allows users to select a base pattern and modify it using natural language instructions to create unique textile designs.

## Features

- **Pattern Selection**: Choose from a library of traditional base patterns (e.g., Hikari-ji, Haneiro).
- **AI-Powered Generation**: Modify patterns using text instructions (e.g., "Make it a checkerboard", "Add stripes").
- **Hybrid AI Engine**:
  - **Cloud API**: Connects to OpenAI for high-quality generation.
  - **Local (Mock)**: A rule-based engine for testing and offline development (supports commands like `stripe`, `checkerboard`, `invert`, `reset`).
- **Interactive Workspace**: Chat-based interface with real-time visual feedback and shared element transitions.
- **Modern UI**: Mobile-first design with bilingual support (Japanese/English).

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS (v4), Framer Motion
- **Backend**: Python, FastAPI, NumPy, OpenAI SDK
- **Package Management**: `npm` (Frontend), `uv` (Backend)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.12+)
- [uv](https://github.com/astral-sh/uv) (Python package manager)

### 1. Backend Setup

```bash
cd backend

# Install dependencies and run server
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### 3. Usage

1. Open the frontend URL in your browser.
2. Click **"α版を試す" (Try Alpha)**.
3. Select a base pattern from the list.
4. In the workspace, type instructions in the chat (e.g., "stripe", "checkerboard" if using Local Mock mode) to generate new patterns.

## Configuration

To use the **Cloud API** mode, you need an OpenAI API Key.
1. Create a `.env` file in the `backend` directory based on `.env.example`.
2. Add your key: `OPENAI_API_KEY=sk-...`


## Deployment (Vercel)

This project is configured as a Monorepo for Vercel deployment (Frontend + Python Backend).

1. **Install Vercel CLI** (Optional, or connect via GitHub):
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment Variables**:
   In your Vercel Project Settings, add:
   - `OPENAI_API_KEY`: Your OpenAI API key.
   - `VITE_API_URL`: (Optional) If you deploy frontend/backend separately. For Monorepo, leave it empty or set to `/api` (automatically handled).

3. **Deploy from GitHub**:
   - Push your code to GitHub.
   - Import the repository in Vercel.
   - Vercel should automatically detect the configuration from `vercel.json`.
   - **Framework Preset**: Use "Vite" for the Frontend if asked, but `vercel.json` usually handles it.
   - **Root Directory**: Keep it as `./` (Project Root).

4. **Verify**:
   - The frontend will be served at `https://your-project.vercel.app`.
   - The backend API will be at `https://your-project.vercel.app/api/...`.

## License

[MIT](LICENSE)
