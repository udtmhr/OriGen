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

Create local environment files from the tracked examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set private backend credentials only in `backend/.env` or in the deployment
platform's secret store. Variables prefixed with `VITE_` are embedded in the
browser bundle, so they must never contain private credentials such as a
Supabase service-role key. `VITE_SUPABASE_ANON_KEY` is intended to be public;
protect application data with Supabase Row Level Security policies.

Do not commit `.env`, `.env.local`, backup environment files, API keys, or
service-role credentials.



## Deployment (Vercel)

Deploy this repository as **two separate projects** on Vercel:

### 1. Backend Project
1. Import the repository.
2. Set **Root Directory** to `backend`.
3. Select **Framework Preset**: `Other` (or utilize `@vercel/python` automatically).
4. Add Environment Variable:
   - `OPENAI_API_KEY`: Your OpenAI API key.
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob read/write token.
   - `SUPABASE_URL`: Your Supabase project URL.
   - `SUPABASE_KEY`: A server-side Supabase key with only the permissions the backend requires.
5. Deploy.
6. **Copy the assigned domain** (e.g., `https://origen-backend.vercel.app`).

### 2. Frontend Project
1. Import the repository (again).
2. Set **Root Directory** to `frontend`.
3. Select **Framework Preset**: `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: The URL of your Backend Project (e.g., `https://origen-backend.vercel.app`).
   - `VITE_SUPABASE_URL`: Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your public Supabase anon key.
5. Deploy.

## License

[MIT](LICENSE)
