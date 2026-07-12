import MessageBubble from './MessageBubble.jsx'

export default function MessageList({ messages, streamingMessage }) {
  return (
    <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 max-w-3xl mx-auto w-full">
      {messages.map((message, index) => (
        <MessageBubble key={message.id} message={message} index={index} />
      ))}

      {streamingMessage && (
        <MessageBubble
          message={streamingMessage}
          index={messages.length}
          isStreaming
        />
      )}
    </div>
  )
}
