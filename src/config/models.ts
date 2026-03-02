export const GEMINI_MODELS = ['gemini', 'gemini-3-flash-preview'] as const;
export const SARVAM_MODELS = ['sarvam', 'sarvam-m'] as const;
export const ALL_MODELS = [...GEMINI_MODELS, ...SARVAM_MODELS] as const;
