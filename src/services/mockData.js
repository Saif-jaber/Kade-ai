// TODO: connect to backend - replace all mock functions with real API calls
// These functions simulate async behavior and return realistic dummy data.
// The input/output shapes are designed to be drop-in replacements for real endpoints.

const MOCK_RESPONSES = {
  default: `I'd be happy to help you with that! Here's a comprehensive response:

## Overview

This is a simulated response from the Kade AI mock service layer. In production, this would be replaced with a real API call to your backend.

### Key Points

1. **Response Streaming**: The text you see appearing word-by-word is simulated using \`setTimeout\` intervals. When connected to a real backend, you'd use Server-Sent Events (SSE) or WebSockets.

2. **Thinking Steps**: The processing steps shown before the response are mock data. A real backend would stream these as part of the response lifecycle.

3. **Message History**: All conversations are currently stored in React state. For persistence, you'd want to connect to a database.

\`\`\`javascript
// Example: connecting to a real API
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, conversationId })
})
\`\`\`

> **Note**: The \`services/mockData.js\` file contains all mock functions. Swap these out for real \`fetch\` calls to your REST or GraphQL endpoint.

Is there anything specific you'd like me to elaborate on?`,

  code: `Here's an example implementation:

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let current = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + current;
    prev = current;
    current = next;
  }
  
  return current;
}

// Usage
console.log(fibonacci(10)); // 55
\`\`\`

This iterative approach has **O(n)** time complexity and **O(1)** space complexity, making it much more efficient than the recursive version.`,

  explain: `Great question! Let me break this down:

## What is this concept?

At its core, this is about **structured communication between systems**. Here's how it works:

1. **Request Phase**: The client sends a structured request with necessary parameters
2. **Processing Phase**: The server processes the request, potentially consulting multiple data sources
3. **Response Phase**: The server returns a formatted response

### Why it matters

| Aspect | Benefit |
|--------|---------|
| Modularity | Each component can be developed independently |
| Scalability | Systems can grow without affecting others |
| Maintainability | Changes in one system don't cascade |

> The key insight is that well-designed interfaces create **loose coupling** between systems.

Would you like me to dive deeper into any of these aspects?`,
}

/**
 * Mock function that simulates an assistant reply.
 * Returns a fake response based on the user's input.
 *
 * TODO: connect to backend - replace with actual API call
 * @param {string} userMessage - The user's message content
 * @returns {{ content: string, thinkingSteps: Array }} - The assistant's response
 */
export function MOCK_ASSISTANT_REPLY(userMessage) {
  const lower = userMessage.toLowerCase()

  if (lower.includes('code') || lower.includes('function') || lower.includes('python') || lower.includes('javascript')) {
    return { content: MOCK_RESPONSES.code }
  }

  if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does') || lower.includes('compare')) {
    return { content: MOCK_RESPONSES.explain }
  }

  return { content: MOCK_RESPONSES.default }
}

/**
 * TODO: connect to backend - replace with actual API call
 * Simulates fetching the list of conversations.
 * @returns {Promise<Array>} - Array of conversation objects
 */
export async function getConversations() {
  await new Promise(resolve => setTimeout(resolve, 300))
  return []
}

/**
 * TODO: connect to backend - replace with actual API call
 * Simulates sending a message and getting a streaming response.
 * @param {string} message - The user's message
 * @param {string} conversationId - The conversation ID
 * @returns {AsyncGenerator<string>} - Yields text chunks
 */
export async function* streamMessage(message, conversationId) {
  const response = MOCK_ASSISTANT_REPLY(message)
  const tokens = response.content.split(/(\s+)/)

  for (const token of tokens) {
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40))
    yield token
  }
}

/**
 * TODO: connect to backend - replace with actual API call
 * Simulates creating a new conversation.
 * @param {string} title - The conversation title
 * @returns {Promise<object>} - The new conversation object
 */
export async function createConversation(title = 'New conversation') {
  await new Promise(resolve => setTimeout(resolve, 200))
  return {
    id: `conv-${Date.now()}`,
    title,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * TODO: connect to backend - replace with actual API call
 * Simulates deleting a conversation.
 * @param {string} conversationId - The conversation to delete
 * @returns {Promise<void>}
 */
export async function deleteConversation(conversationId) {
  await new Promise(resolve => setTimeout(resolve, 200))
}

/**
 * TODO: connect to backend - replace with actual API call
 * Simulates renaming a conversation.
 * @param {string} conversationId - The conversation to rename
 * @param {string} title - The new title
 * @returns {Promise<void>}
 */
export async function renameConversation(conversationId, title) {
  await new Promise(resolve => setTimeout(resolve, 200))
}
