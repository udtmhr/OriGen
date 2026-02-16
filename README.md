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

Deploy this repository as **two separate projects** on Vercel:

### 1. Backend Project
1. Import the repository.
2. Set **Root Directory** to `backend`.
3. Select **Framework Preset**: `Other` (or utilize `@vercel/python` automatically).
4. Add Environment Variable:
   - `OPENAI_API_KEY`: Your OpenAI API key.
5. Deploy.
6. **Copy the assigned domain** (e.g., `https://origen-backend.vercel.app`).

### 2. Frontend Project
1. Import the repository (again).
2. Set **Root Directory** to `frontend`.
3. Select **Framework Preset**: `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: The URL of your Backend Project (e.g., `https://origen-backend.vercel.app`).
5. Deploy.

## License

[MIT](LICENSE)
