// API Service for the Christian Library Assistant

import { API_CONFIG, getApiUrl } from './config';

export interface Source {
  record_id: string;
  link: string;
  citation_text: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ApiResponse {
  answer: string;
  sources: Source[];
  conversation_history: ConversationMessage[];
  session_id: string;
}

export interface ApiRequestBody {
  query: string;
  authors?: string[];
  works?: string[];
}

export interface SessionStatusResponse {
  message_count?: number;
  created_at?: string;
  exists?: boolean;
  message?: string;
  session_id?: string;
  total_sessions?: number;
}

export interface Author {
  author_id: string;
  similarity_score: number;
}

export interface Work {
  work_id: string;
  similarity_score: number;
}

export interface AuthorsResponse {
  query?: string;
  total_matches?: number;
  matches?: Author[];
  authors?: string[];
  total?: number;
  note?: string;
}

export interface WorksResponse {
  query?: string;
  total_matches?: number;
  matches?: Work[];
  works?: string[];
  total?: number;
  note?: string;
}

/**
 * Sends a query to the Christian Library Assistant API with agentic conversation
 *
 * @param query - The user's query string
 * @param sessionId - The session ID for conversation continuity
 * @param authors - Optional list of author IDs to filter search results
 * @param works - Optional list of work IDs to filter search results
 * @returns Promise with the API response
 */
export async function queryAgentApi(
  query: string,
  sessionId: string,
  authors?: string[],
  works?: string[]
): Promise<ApiResponse> {
  const apiUrl = getApiUrl(API_CONFIG.endpoints.queryAgent);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const requestBody: ApiRequestBody = { query };
    if (authors && authors.length > 0) {
      requestBody.authors = authors;
    }
    if (works && works.length > 0) {
      requestBody.works = works;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Session-ID": sessionId,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before sending another query.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Request failed: ${response.status}`);
      }
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    console.error("Error querying agent API:", error);
    throw error;
  }
}

/**
 * Gets the status of a conversation session
 *
 * @param sessionId - The session ID to check
 * @returns Promise with session status
 */
export async function getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
  const apiUrl = getApiUrl(API_CONFIG.endpoints.sessionStatus);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Session-ID": sessionId,
      },
    });

    if (!response.ok) {
      throw new Error(`Session status request failed with status ${response.status}`);
    }

    return (await response.json()) as SessionStatusResponse;
  } catch (error) {
    console.error("Error getting session status:", error);
    throw error;
  }
}

/**
 * Resets a conversation session (clears history but keeps session)
 *
 * @param sessionId - The session ID to reset
 * @returns Promise that resolves when reset is complete
 */
export async function resetSession(sessionId: string): Promise<void> {
  const apiUrl = getApiUrl(API_CONFIG.endpoints.sessionReset);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "X-Session-ID": sessionId,
      },
    });

    if (!response.ok) {
      throw new Error(`Session reset failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error resetting session:", error);
    throw error;
  }
}

/**
 * Deletes a conversation session completely
 *
 * @param sessionId - The session ID to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const apiUrl = getApiUrl(API_CONFIG.endpoints.sessionDelete);

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "X-Session-ID": sessionId,
      },
    });

    if (!response.ok) {
      throw new Error(`Session deletion failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

/**
 * Generates a unique session ID
 *
 * @returns A unique session ID string
 */
export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Search for authors in the CCEL database
 *
 * @param query - Optional search query for fuzzy matching. If not provided, returns all authors.
 * @returns Promise with list of matching authors
 */
export async function searchAuthors(query?: string): Promise<AuthorsResponse> {
  const apiUrl = getApiUrl(API_CONFIG.endpoints.authors);
  const url = query ? `${apiUrl}?query=${encodeURIComponent(query)}` : apiUrl;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Authors search failed with status ${response.status}`);
    }

    return (await response.json()) as AuthorsResponse;
  } catch (error) {
    console.error("Error searching authors:", error);
    throw error;
  }
}

/**
 * Search for works in the CCEL database
 *
 * @param query - Optional search query for fuzzy matching. If not provided, returns all works.
 * @returns Promise with list of matching works
 */
export async function searchWorks(query?: string): Promise<WorksResponse> {
  const apiUrl = getApiUrl(API_CONFIG.endpoints.works);
  const url = query ? `${apiUrl}?query=${encodeURIComponent(query)}` : apiUrl;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Works search failed with status ${response.status}`);
    }

    return (await response.json()) as WorksResponse;
  } catch (error) {
    console.error("Error searching works:", error);
    throw error;
  }
}

// Legacy function for backward compatibility - will be removed in future versions
export async function queryChatApi(
  query: string,
  _conversationHistory: any[]
): Promise<ApiResponse> {
  console.warn('queryChatApi is deprecated. Use queryAgentApi with session management instead.');

  // Generate a temporary session ID for legacy calls
  const tempSessionId = generateSessionId();
  return queryAgentApi(query, tempSessionId);
}
