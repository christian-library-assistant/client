// Configuration for the Christian Library Assistant

export const API_CONFIG = {
  // Base URL for the Christian Library Assistant API
  baseUrl: process.env.url || 'http://localhost:8000',

  // API endpoints
  endpoints: {
    queryAgent: '/query-agent',
    sessionStatus: '/query-agent-sessions',
    sessionReset: '/query-agent-reset',
    sessionDelete: '/query-agent-session'
  },

  // Request configuration
  timeout: 30000, // 30 seconds for agent processing
} as const;

/**
 * Gets the full URL for an API endpoint
 * @param endpoint - The endpoint path
 * @returns The complete URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.baseUrl}${endpoint}`;
}