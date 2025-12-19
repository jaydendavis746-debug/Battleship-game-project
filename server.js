const express = require('express')
const path = require('path')
const http = require('http')
const socketIo = require('socket.io')

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)

// Track players: null | false (connected) | true (ready)
const connections = [null, null]

io.on('connection', socket => {
  let playerIndex = -1

  // Assign player slot
  for (let i = 0; i < connections.length; i++) {
    if (connections[i] === null) {
      playerIndex = i
      break
    }
  }

  socket.emit('player-number', playerIndex)

  if (playerIndex === -1) return

  console.log(`Player ${playerIndex} connected`)
  connections[playerIndex] = false

  // Notify others
  socket.broadcast.emit('player-connection', playerIndex)

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`)
    connections[playerIndex] = null
    socket.broadcast.emit('player-connection', playerIndex)
  })

  // ✅ READY (FIXED)
  socket.on('player-ready', () => {
    connections[playerIndex] = true
    socket.broadcast.emit('enemy-ready', playerIndex)
  })

  // Check players
  socket.on('check-players', () => {
    const players = connections.map(c =>
      c === null
        ? { connected: false, ready: false }
        : { connected: true, ready: c }
    )
    socket.emit('check-players', players)
  })

  socket.on('fire', id => {
    socket.broadcast.emit('fire', id)
  })

  // Relay fire result
  socket.on('fire-reply', data => {
    socket.broadcast.emit('fire-reply', data)
  })
})
