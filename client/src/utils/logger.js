const HISTORY_LENGTH = 10

const container = document.getElementById('logger')
const entries = []
const timers = {}

let lastEntry

function updateLog () {
  container.innerHTML = entries.map(m => m.value).join('<br>')
}

function escapeHtml (unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function log (message, method = 'log') {
  if (!window.ENV.app.logger) return
  if (entries.length >= HISTORY_LENGTH) entries.shift()

  if (lastEntry && lastEntry.message === message) {
    lastEntry.increment()
    return
  }

  lastEntry = {
    time: new Date(),
    message,
    method,
    counter: 0,
    increment: function () {
      this.counter++
      this.time = new Date()
      updateLog()
    },

    update: function (message) {
      this.message = message
      updateLog()
    },

    get value () {
      return `[${this.time.toUTCString()}] ${this.counter ? `[${this.counter}]` : ''} <span class='${this.method}'>${escapeHtml(this.message)}</span>`
    }
  }

  entries.push(lastEntry)
  updateLog()
  return lastEntry
}

export const warn = message => log(message, 'warn')
export const error = message => log(message, 'error')

export function time (name) {
  timers[name] = Date.now()
  const entry = log(name + ': …')

  return {
    end: () => {
      const message = name + ': ' + (Date.now() - timers[name]) + 'ms'

      if (entries.includes(entry)) entry.update(message)
      else log(message)

      delete timers[name]
    }
  }
}
