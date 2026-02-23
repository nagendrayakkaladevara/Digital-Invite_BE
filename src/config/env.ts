const REQUIRED_VARS = ['MONGODB_URI', 'GEMINI_API_KEY', 'SARVAM_API_KEY'] as const;

export const validateEnv = (): void => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
