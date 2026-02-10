const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;

export const getPatterns = async () => {
    const response = await fetch(`${API_BASE_URL}/patterns`);
    if (!response.ok) throw new Error("Failed to fetch patterns");
    return response.json();
};

export const getPattern = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/patterns/${id}`);
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
    return response.json();
};
