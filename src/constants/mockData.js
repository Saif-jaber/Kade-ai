export const EXAMPLE_PROMPTS = [
  {
    id: '1',
    title: 'Explain quantum computing',
    subtitle: 'in simple terms',
    icon: 'atom',
  },
  {
    id: '2',
    title: 'Write a Python function',
    subtitle: 'to sort a list of dictionaries',
    icon: 'code',
  },
  {
    id: '3',
    title: 'Help me draft an email',
    subtitle: 'requesting a deadline extension',
    icon: 'mail',
  },
  {
    id: '4',
    title: 'Compare REST vs GraphQL',
    subtitle: 'pros and cons of each approach',
    icon: 'git-compare',
  },
]

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    title: 'Getting started with React hooks',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What are the most important React hooks I should know about?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Here are the most essential React hooks:\n\n## useState\nManages component state. Returns the current state and a setter function.\n\n```javascript\nconst [count, setCount] = useState(0)\n```\n\n## useEffect\nHandles side effects like data fetching, subscriptions, or DOM manipulation.\n\n```javascript\nuseEffect(() => {\n  document.title = `Count: ${count}`\n}, [count])\n```\n\n## useContext\nAccesses context values without prop drilling.\n\n## useRef\nReferences DOM elements or persists values across renders without causing re-renders.\n\n## useMemo & useCallback\nPerformance optimization hooks that memoize values and functions respectively.',
        thinkingSteps: [
          { id: 'ts-1', type: 'thinking', status: 'completed', title: 'Understanding request' },
          { id: 'ts-2', type: 'search', status: 'completed', title: 'Searching the web', subtitle: 'React hooks best practices', children: [
            { id: 'ts-2a', title: 'Querying "React hooks"', status: 'completed' },
            { id: 'ts-2b', title: 'Reading results', status: 'completed' },
          ]},
          { id: 'ts-3', type: 'sparkles', status: 'completed', title: 'Writing response' },
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
  },
  {
    id: 'conv-2',
    title: 'CSS Grid layout tutorial',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'How do I create a responsive grid layout with CSS Grid?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'CSS Grid makes responsive layouts straightforward. Here\'s a practical example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n  padding: 1rem;\n}\n```\n\nThis creates a grid where:\n- Items are at least 300px wide\n- They stretch to fill available space\n- The layout adapts automatically to screen size\n\n> **Tip:** Use `auto-fit` instead of `auto-fill` when you want items to stretch to fill the container.',
        thinkingSteps: [
          { id: 'ts-4', type: 'thinking', status: 'completed', title: 'Understanding request' },
          { id: 'ts-5', type: 'search', status: 'completed', title: 'Searching the web', subtitle: 'CSS Grid responsive layout', children: [
            { id: 'ts-5a', title: 'Querying "CSS Grid layout"', status: 'completed' },
            { id: 'ts-5b', title: 'Reading results', status: 'completed' },
          ]},
          { id: 'ts-6', type: 'sparkles', status: 'completed', title: 'Writing response' },
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000).toISOString(),
  },
  {
    id: 'conv-3',
    title: 'Database design best practices',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'What are the best practices for designing a scalable database schema?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: 'Here are key database design best practices for scalability:\n\n1. **Normalize strategically** - Start with 3NF, denormalize only when performance requires it\n\n2. **Index thoughtfully** - Add indexes on frequently queried columns, but avoid over-indexing\n\n3. **Use appropriate data types** - Choose the smallest type that fits your data\n\n4. **Plan for growth** - Consider partitioning strategies early\n\n5. **Implement proper constraints** - Foreign keys, unique constraints, and check constraints maintain data integrity\n\n| Practice | Benefit |\n|---|---|\n| Normalization | Reduces redundancy |\n| Indexing | Speeds up queries |\n| Partitioning | Handles large datasets |\n| Connection pooling | Manages concurrent access |',
        thinkingSteps: [
          { id: 'ts-7', type: 'thinking', status: 'completed', title: 'Understanding request' },
          { id: 'ts-8', type: 'database', status: 'completed', title: 'Analyzing schema patterns', children: [
            { id: 'ts-8a', title: 'Reviewing normalization', status: 'completed' },
            { id: 'ts-8b', title: 'Checking indexing strategies', status: 'completed' },
          ]},
          { id: 'ts-9', type: 'sparkles', status: 'completed', title: 'Writing response' },
        ],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8 + 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8 + 1000).toISOString(),
  },
]
