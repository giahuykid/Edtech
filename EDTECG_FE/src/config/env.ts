/**
 * Environment configuration utility
 * This file provides type-safe access to environment variables
 */

export const env = {
    // API Configuration
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    apiVersion: process.env.REACT_APP_API_VERSION || 'v1',

    // Feature Flags
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    debugMode: process.env.REACT_APP_DEBUG_MODE === 'true',

    // Other Configuration
    appName: process.env.REACT_APP_APP_NAME || 'EDTECG',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const;

// Type for environment configuration
export type EnvConfig = typeof env;

export default env; 