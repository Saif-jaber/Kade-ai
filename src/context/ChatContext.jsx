import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { v4Helper } from '../utils/helpers.js'
import { MOCK_CONVERSATIONS } from '../constants/mockData.js'
import { streamChat } from '../services/ollama.js'
import { searchWeb, needsSearch } from '../services/search.js'

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

    const shouldSearch = needsSearch(content)
    const steps = []

    setIsThinking(true)
    setThinkingSteps([])

    steps.push({ id: v4Helper(), label: 'Thinking', icon: 'search' })
    setThinkingSteps(prev => [...prev, steps[0]])
    await new Promise(resolve => setTimeout(resolve, 200))

    steps.push({ id: v4Helper(), label: 'Processing', icon: 'cpu' })
    setThinkingSteps(prev => [...prev, steps[1]])
    await new Promise(resolve => setTimeout(resolve, 150))

    let searchContext = ''

    if (shouldSearch) {
      steps.push({ id: v4Helper(), label: `Searching: "${content.slice(0, 40)}..."`, icon: 'search' })
      setThinkingSteps(prev => [...prev, steps[2]])

      const searchResults = await searchWeb(content)

      if (searchResults.length > 0) {
        searchContext = '\n\n[Search results:\n' +
          searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n') +
          '\nUse these to answer the user accurately.]'
      }

      steps.push({ id: v4Helper(), label: 'Processing results', icon: 'cpu' })
      setThinkingSteps(prev => [...prev, steps[3]])
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