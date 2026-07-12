# Kade AI Chat

A frontend-only React application for an AI chatbot UI, styled and behaving like Claude.ai / Manus. This is the client layer only — no backend, no database.

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS 3** for styling
- **lucide-react** for icons
- **react-markdown** + **remark-gfm** for Markdown rendering
- **react-syntax-highlighter** for code blocks

## Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatArea.jsx          # Main chat container with scroll management
│   │   ├── ChatInput.jsx         # Auto-expanding textarea with send/stop
│   │   ├── ClarifyingQuestion.jsx # Interactive question card component
│   │   ├── CodeBlock.jsx         # Syntax-highlighted code with copy button
│   │   ├── EmptyState.jsx        # Welcome screen with example prompts
│   │   ├── MessageBubble.jsx     # Individual message with markdown rendering
│   │   ├── MessageList.jsx       # Message list container
│   │   └── ThinkingPanel.jsx     # Collapsible reasoning steps display
│   ├── common/
│   │   ├── LoadingDots.jsx       # Animated loading indicator
│   │   └── ThemeToggle.jsx       # Dark/light mode switch
│   ├── layout/
│   │   ├── AppLayout.jsx         # Root layout wrapper
│   │   └── Header.jsx            # Top bar with sidebar toggle and theme
│   └── sidebar/
│       └── Sidebar.jsx           # Conversation list with groups and CRUD
├── context/
│   ├── ChatContext.jsx           # Chat state management (conversations, streaming)
│   └── ThemeContext.jsx          # Dark/light mode state
├── constants/
│   └── mockData.js               # Static mock data (conversations, prompts)
├── services/
│   └── mockData.js               # Mock API functions with TODO markers
├── utils/
│   └── helpers.js                # Utility functions (ID generation, date formatting)
├── App.jsx                       # Root component
├── main.jsx                      # Entry point
└── index.css                     # Global styles and Tailwind layers
```

## Features

1. **Chat Interface** — Markdown rendering, syntax-highlighted code blocks, streaming text simulation, auto-scroll with user override
2. **Thinking Panel** — Collapsible step-by-step reasoning display with animated indicators
3. **Clarifying Questions** — Interactive card component for single/multi-select options
4. **Sidebar** — Conversation list grouped by recency with rename, delete, and new chat
5. **Dark/Light Mode** — Persistent theme toggle with system preference detection
6. **Responsive** — Works on mobile (320px), tablet (768px), and desktop (1440px)
7. **Empty State** — Welcome screen with example prompt suggestions

## Connecting to a Backend

All backend integration points are marked with `// TODO: connect to backend`. The key files:

### `src/services/mockData.js`

Contains mock API functions that simulate async behavior:

| Function | Purpose | Replace with |
|----------|---------|--------------|
| `MOCK_ASSISTANT_REPLY(message)` | Generates a fake response | `fetch('/api/chat', ...)` |
| `getConversations()` | Returns empty array | `fetch('/api/conversations')` |
| `streamMessage(message, conversationId)` | Async generator yielding tokens | SSE/WebSocket stream |
| `createConversation(title)` | Creates a mock conversation | `fetch('/api/conversations', { method: 'POST' })` |
| `deleteConversation(id)` | Simulates deletion | `fetch('/api/conversations/${id}', { method: 'DELETE' })` |
| `renameConversation(id, title)` | Simulates rename | `fetch('/api/conversations/${id}', { method: 'PATCH' })` |

### `src/context/ChatContext.jsx`

The `sendMessage` function handles the full lifecycle:
1. Adds user message to state
2. Shows thinking steps
3. Streams the assistant response token-by-token
4. Saves the final message

To connect to a real backend, replace the mock streaming logic with `fetch()` using `ReadableStream` or an SSE endpoint.

### Message Data Shape

```javascript
{
  id: string,
  role: 'user' | 'assistant',
  content: string,
  thinkingSteps?: [{ id: string, label: string, icon: string }],
  timestamp: string // ISO 8601
}
```

### Conversation Data Shape

```javascript
{
  id: string,
  title: string,
  messages: Message[],
  createdAt: string,
  updatedAt: string
}
```

## Extending

- **Add new message types**: Extend `MessageBubble.jsx` to handle different `role` values or message metadata
- **Real streaming**: Use `fetch` with `response.body.getReader()` to consume a `ReadableStream`
- **Persistence**: Replace React state in `ChatContext` with API calls and local storage fallback
- **Auth**: Add an `AuthContext` and wrap API calls with token headers
