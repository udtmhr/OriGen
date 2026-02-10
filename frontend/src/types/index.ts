export interface Pattern {
    id: string;
    name: string;
    name_kanji?: string;
    name_romaji?: string;
    image_url?: string;
    width: number;
    height: number;
    grid: number[][]; // 0 or 1 for now, maybe more capabilities later
    description?: string;
    createdAt?: string;
}

export interface GenerationRequest {
    basePatternId?: string;
    instruction: string;
    grid?: number[][]; // If modifying current state
}
