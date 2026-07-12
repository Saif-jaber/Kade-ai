let interval = null

self.onmessage = function(e) {
  if (e.data.type === 'start') {
    const { tokens, delays } = e.data
    let i = 0

    interval = setInterval(() => {
      if (i >= tokens.length) {
        clearInterval(interval)
        self.postMessage({ type: 'done' })
        return
      }
      self.postMessage({ type: 'token', token: tokens[i], delay: delays[i] })
      i++
    }, 0)
  }

  if (e.data.type === 'stop') {
    clearInterval(interval)
  }
}