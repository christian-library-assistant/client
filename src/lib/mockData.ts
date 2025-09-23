// Mock data for testing the chat interface

export interface MockResponse {
  answer: string;
  sources: Array<{
    record_id: string;
    link: string;
    citation_text: string;
  }>;
  conversation_history: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  session_id: string;
}

// Function to generate a mock response based on the user query
export function generateMockResponse(query: string, previousHistory: Array<{ role: "user" | "assistant"; content: string; }>, sessionId: string = "mock-session"): MockResponse {
  // Create a new conversation history array with the current query
  const updatedHistory = [...previousHistory, { role: "user" as const, content: query }];

  let mockAnswer = "";
  let mockSources = [];

  // Generate different responses based on query content
  // what does augustine think of trinity
  if (query.toLowerCase().includes("trinity") || query.toLowerCase().includes("augustine")) {
    mockAnswer =
      'Augustine thought quite deeply about the Trinity! He strongly believed that "one God is one divinely named Trinity" (Augustine, Sermon on Faith). He saw the Trinity of divine persons as the "supreme good," accessible to minds that are purified (Augustine, De Trinitate, Book ii).  He also described God as being "absolutely and altogether simple" (Augustine, De Trinitate, Book 4, Chapter 6, Section 7) even while being a Trinity, and that the Father is the "Principle of the whole Deity" (Augustine, De Trinitate, Book 4, Chapter 20).  A significant part of his thought involved seeing a "trace of the Trinity" present in creation, particularly in the human soul or mind. He identified this image in the mind as consisting of mind, knowledge, and love (Augustine, De Trinitate, Book 9, Chapter 4). He related this concept to intellectual vision and how knowing God creates a likeness of Him in us (Augustine, De Trinitate, Book 5).  It\'s worth noting that while the human mind reflects the Trinity, Augustine also pointed out that the Son alone is called the "image of the Father" (Augustine, De Trinitate, Book 6, Chapter 2).';
    mockSources = [
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q39_A6-p4",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q39_A6.html",
        citation_text: "Augustine, Sermon on Faith",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q6_A2-p5",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q6_A2.html",
        citation_text: "Augustine, De Trinitate, Book ii",
      },
      {
        record_id: "ccel/a/aquinas/nature_grace.xml:vi.iii.vii-p4",
        link: "https://ccel.org/ccel/aquinas/nature_grace/nature_grace.vi.iii.vii.html",
        citation_text: "Augustine, De Trinitate, Book 4, Chapter 6, Section 7",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q33_A1-p5",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q33_A1.html",
        citation_text: "Augustine, De Trinitate, Book 4, Chapter 20",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q45_A7-p5",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q45_A7.html",
        citation_text: "Augustine, De Trinitate, Book vi, Chapter 10",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q93_A7-p8",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q93_A7.html",
        citation_text: "Augustine, De Trinitate, Book ix, Chapter 4",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q93_A7-p6",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q93_A7.html",
        citation_text: "Augustine, De Trinitate, Book xi, Chapter 2 seqq.",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q12_A2-p3",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q12_A2.html",
        citation_text: "Augustine, De Trinitate, Book 5",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q93_A5-p5",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q93_A5.html",
        citation_text: "Augustine, De Trinitate, Book 6, Chapter 2",
      },
      {
        record_id: "ccel/a/aquinas/summa.xml:FP_Q93_A6-p5",
        link: "https://ccel.org/ccel/aquinas/summa/summa.FP_Q93_A6.html",
        citation_text: "Augustine, Genesis ad litteram, Book xii, Chapter 7, Section 24",
      },
    ];
  } else if (query.toLowerCase().includes("book") || query.toLowerCase().includes("literature")) {
    mockAnswer =
      "I found several books on that topic in our library. The most relevant ones include 'Introduction to Philosophy' by John Smith, 'The History of Western Thought' by Emily Johnson, and 'Modern Philosophical Debates' by Michael Williams.";
    mockSources = [
      {
        record_id: "library/catalog/12345",
        link: "https://library.example.com/catalog/12345",
        citation_text: "Smith, J. (2020). Introduction to Philosophy",
      },
      {
        record_id: "library/catalog/67890",
        link: "https://library.example.com/catalog/67890",
        citation_text: "Johnson, E. (2018). The History of Western Thought",
      },
      {
        record_id: "library/catalog/54321",
        link: "https://library.example.com/catalog/54321",
        citation_text: "Williams, M. (2022). Modern Philosophical Debates",
      },
    ];
  } else {
    mockAnswer =
      'Based on your query about "' +
      query +
      '", I found some relevant resources in our database. Would you like me to provide more specific information on any particular aspect of this topic?';
    mockSources = [
      {
        record_id: "general/reference/001",
        link: "https://example.com/reference/001",
        citation_text: "General Encyclopedia, Volume 3",
      },
      {
        record_id: "academic/journal/002",
        link: "https://example.com/journal/002",
        citation_text: "Academic Journal of Research, 2023",
      },
    ];
  }

  return {
    answer: mockAnswer,
    sources: mockSources,
    conversation_history: updatedHistory,
    session_id: sessionId,
  };
}
