const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketIo = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

// set static folder

app.use(express.static(path.join(__dirname, 'public')));

// start server 

server.listen(PORT, () => console.log(`Server running on port ${PORT} `));

// Hnadle a socket connection request from web client

const connections= [null, null]

io.on('connection', socket =>{                  // socket: the client that is being connected 
//console.log('New WS Connection')  
    
    // find an available player number 

let playerIndex = -1;
for(const i in connections){
    if(connections[i] === null){
        playerIndex = i ;
        break;
    }
}
// Tell the connecting client what player they are
socket.emit('player-number', playerIndex)

console.log(`player ${playerIndex} has connected`) ;

// ignore player 3
if (playerIndex === -1){
    return;
}

connections[playerIndex] = false;

// Tell everyone what player number just connected 

socket.broadcast.emit('Player-Connection', playerIndex)

// hnadle disconnect
socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`)
    connections[playerIndex] = null
    
    // Tell everyone what player number just disconnected
    socket.broadcast.emit('player-connection', playerIndex)
})

// On Ready
 
socket.on('player-ready',() =>{
    socket.broadcast.emit('enemy-ready'. playerIndex)
    connections[playerIndex] = true
})
// check players connections
socket.on('check-players', () => {
    const players = []
    for (const i in connections){
        connections[i]=== null ? players.push({connected: false, ready: false}):
        players.push({connected: true, ready: connections[i]})
    }
    socket.emit('check-players',players)
})

// On fire recieved
socket.on('fire', id => {
    console.log(`shot fired from ${playerIndex} `, id)

    // Emit the move to the other player
    socket.emit('fire', id)
})

// on fire reply

socket.on('fire-reply', blocks =>{
    console.log(blocks)

    //forward the reply to the other player
    socket.broadcast.emit('fire-reply', blocks )
})

})

