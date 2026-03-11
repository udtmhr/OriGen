import { supabase } from '../lib/supabase';

// Priority: 1. Env Var (Vercel/Cloud), 2. Localhost (Dev fallback)
// Priority: 1. Env Var, 2. Localhost (Dev), 3. Relative (Prod)
const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');
console.log("Current API_BASE_URL:", API_BASE_URL, "Hostname:", window.location.hostname);

export const getPatterns = async (searchQuery: string = '') => {
    let query = supabase.from('patterns').select('*').eq('is_public', true).order('created_at', { ascending: false });
    if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const getPattern = async (id: string) => {
    const { data, error } = await supabase.from('patterns').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
};

export const saveGeneratedPattern = async (
    base64DataUrl: string,
    name: string,
    description: string,
    isPublic: boolean,
    userId: string
) => {
    // Convert base64 to Blob
    const response = await fetch(base64DataUrl);
    const blob = await response.blob();
    
    // Generate unique filename
    const filename = `${userId}/${Date.now()}.jpg`;
    
    // Upload image to storage
    const { error: uploadError } = await supabase.storage
        .from('patterns')
        .upload(filename, blob, {
            contentType: 'image/jpeg',
        });
        
    if (uploadError) throw new Error(uploadError.message);
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
        .from('patterns')
        .getPublicUrl(filename);
        
    const imageUrl = publicUrlData.publicUrl;
    
    // Insert into database
    const { data: dbData, error: dbError } = await supabase
        .from('patterns')
        .insert({
            user_id: userId,
            name: name,
            description: description,
            image_url: imageUrl,
            is_public: isPublic,
            width: 8,
            height: 8,
        })
        .select()
        .single();
        
    if (dbError) throw new Error(dbError.message);
    return dbData;
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
