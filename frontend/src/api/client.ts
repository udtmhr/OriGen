// Priority: 1. Env Var (Vercel/Cloud), 2. Localhost (Dev fallback)
// Priority: 1. Env Var, 2. Localhost (Dev), 3. Relative (Prod)
const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');
console.log("Current API_BASE_URL:", API_BASE_URL, "Hostname:", window.location.hostname);

export const getPatterns = async () => {
    const response = await fetch(`${API_BASE_URL}/patterns`);
    if (!response.ok) throw new Error("Failed to fetch patterns");
    return response.json();
};

export const getPattern = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/patterns/${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error("Failed to fetch pattern");
    return response.json();
};

export const generatePattern = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to generate pattern");
    return response.json(); // Returns { generated_image_url: "..." }
};
