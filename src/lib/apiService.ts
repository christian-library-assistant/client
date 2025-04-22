// API Service for the Smart Library Assistant

export interface Source {
  record_id: string;
  link: string;
  citation_text: string;
}

export interface ApiResponse {
  answer: string;
  sources: Source[];
  conversation_history: any[];
}

export interface ApiRequestBody {
  query: string;
  conversation_history: any[];
}

/**
 * Sends a query to the Library Assistant API
 *
 * @param query - The user's query string
 * @param conversationHistory - The previous conversation history
 * @returns Promise with the API response
 */
export async function queryChatApi(
  query: string,
  conversationHistory: any[]
): Promise<ApiResponse> {
  const apiUrl = "/jeton/query";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        conversation_history: conversationHistory,
      } as ApiRequestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    console.error("Error querying chat API:", error);
    throw error;
  }
}
