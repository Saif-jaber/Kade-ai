import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { v4Helper } from '../utils/helpers.js'
import { MOCK_CONVERSATIONS } from '../constants/mockData.js'
import { streamChat, routeQuery } from '../services/ollama.js'
import { searchWeb } from '../services/search.js'

const ChatContext = createContext()

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState(null)
  const [thinkingSteps, setThinkingSteps] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const abortRef = useRef(null)
  const savedRef = useRef(false)
  const controllerRef = useRef(null)
  const conversationsRef = useRef(conversations)
  conversationsRef.current = conversations

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null

  const createConversation = useCallback(() => {
    const newConv = {
      id: v4Helper(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(newConv.id)
    return newConv
  }, [])

  const deleteConversation = useCallback((id) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConversationId === id) {
      setActiveConversationId(null)
    }
  }, [activeConversationId])

  const renameConversation = useCallback((id, title) => {
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c)
    )
  }, [])

  const addAssistantMessage = useCallback((convId, content, steps) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c
        return {
          ...c,
          messages: [...c.messages, {
            id: v4Helper(),
            role: 'assistant',
            content,
            thinkingSteps: steps,
            timestamp: new Date().toISOString(),
          }],
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }, [])

  const sendMessage = useCallback(async (content) => {
    let convId = activeConversationId
    if (!convId) {
      const newConv = createConversation()
      convId = newConv.id
    }

    const userMessage = {
      id: v4Helper(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c
        const updatedMessages = [...c.messages, userMessage]
        const title = c.messages.length === 0
          ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
          : c.title
        return { ...c, messages: updatedMessages, title, updatedAt: new Date().toISOString() }
      })
    )

    savedRef.current = false
    controllerRef.current = new AbortController()
    const signal = controllerRef.current.signal

    const steps = []

    setIsThinking(true)
    setThinkingSteps([])

    steps.push({ id: v4Helper(), label: 'Routing query', icon: 'search' })
    setThinkingSteps(prev => [...prev, steps[0]])

    const shouldSearch = await routeQuery(content)

    steps[0].done = true
    steps.push({ id: v4Helper(), label: shouldSearch ? 'Searching web' : 'Using knowledge', icon: 'cpu' })
    setThinkingSteps(prev => [...prev.slice(0, 1), steps[0], steps[1]])
    await new Promise(resolve => setTimeout(resolve, 150))

    let searchContext = ''

    if (shouldSearch) {
      const { results: searchResults, refinedQuery } = await searchWeb(content)

      steps[1].label = `Searching: "${refinedQuery}"`
      setThinkingSteps(prev => [...prev.slice(0, 2), steps[1]])

      if (searchResults.length > 0) {
        searchContext = '\n\n===== LIVE SEARCH RESULTS (use these to answer) =====\n' +
          searchResults.map((r, i) => `[${i + 1}] ${r.title}\n    ${r.snippet}`).join('\n\n') +
          '\n===== END SEARCH RESULTS ====='
      }

      steps.push({ id: v4Helper(), label: 'Processing results', icon: 'cpu' })
      setThinkingSteps(prev => [...prev, steps[2]])
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    steps.push({ id: v4Helper(), label: 'Generating response', icon: 'file-text' })
    setThinkingSteps(prev => [...prev, steps[steps.length - 1]])

    setIsThinking(false)
    setIsStreaming(true)

    const currentConv = conversationsRef.current.find(c => c.id === convId) || { messages: [] }
    const apiMessages = [
      ...currentConv.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: content + searchContext },
    ]

    let accumulated = ''

    setStreamingMessage({
      id: v4Helper(),
      role: 'assistant',
      content: '',
      thinkingSteps: steps,
      timestamp: new Date().toISOString(),
    })

    abortRef.current = { cancelled: false }

    await streamChat(
      apiMessages,
      (token) => {
        if (abortRef.current?.cancelled) return
        accumulated += token
        setStreamingMessage(prev => prev ? { ...prev, content: accumulated } : null)
      },
      () => {
        if (!savedRef.current && accumulated) {
          savedRef.current = true
          addAssistantMessage(convId, accumulated, steps)
        }
        setIsStreaming(false)
        setStreamingMessage(null)
        setThinkingSteps([])
      },
      (err) => {
        console.error('Ollama error:', err)
        setIsStreaming(false)
        setStreamingMessage(null)
        setThinkingSteps([])
        if (!savedRef.current) {
          savedRef.current = true
          addAssistantMessage(convId, `Error: Could not connect to Ollama.\n\n\`${err.message}\``, [])
        }
      },
      signal
    )
  }, [activeConversationId, createConversation, addAssistantMessage])

  const stopStreaming = useCallback(() => {
    abortRef.current = { cancelled: true }
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    if (!savedRef.current && streamingMessage?.content) {
      savedRef.current = true
      setConversations(prev =>
        prev.map(c => {
          if (c.id !== activeConversationId) return c
          return {
            ...c,
            messages: [...c.messages, {
              id: v4Helper(),
              role: 'assistant',
              content: streamingMessage.content,
              thinkingSteps: streamingMessage.thinkingSteps || [],
              timestamp: new Date().toISOString(),
            }],
            updatedAt: new Date().toISOString(),
          }
        })
      )
    }

    setIsStreaming(false)
    setStreamingMessage(null)
    setThinkingSteps([])
    setIsThinking(false)
  }, [activeConversationId, streamingMessage])

  const selectConversation = useCallback((id) => {
    setActiveConversationId(id)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        activeConversationId,
        isStreaming,
        streamingMessage,
        thinkingSteps,
        isThinking,
        sendMessage,
        stopStreaming,
        createConversation,
        deleteConversation,
        renameConversation,
        selectConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}