const port = document.querySelector('#port')
const battlefield = document.querySelector('#battlefield')
const flipButton = document.querySelector('#flip')
const startButton = document.querySelector('#start')
const timer = document.querySelector('#timer')
const turn = document.querySelector('#turn')
const info = document.querySelector('#info')
const singlePlayerbtn = document.querySelector('#singleplayerbutton')
const multiPlayerbtn = document.querySelector('#multiplayerbutton')
const resetButton = document.querySelector('#reset')


// Variables 

let playerNum = 0;
let ready = false;
let allShipsPlaced = false
let shotFired = -1
let currentPlayer = 'user'
let socket
let playersReady = [false, false]


 
const getMyBoard = () => '#player-1 div'
const getEnemyBoard = () => '#player-2 div'




// Multiplayer

const startMultiPlayer = () => {
  if (socket) return


  ready = false
  playersReady = [false, false]
  window.gameStarted = false

  socket = io()
  registerSocketListeners()
}


 const registerSocketListeners = () => {

  socket.on('player-number', num => {
    if (num === -1) {
      info.textContent = 'Server full'
      return
    }

    playerNum = num
    socket.emit('check-players')
  })

  socket.on('player-connection', num => {
    playerConnectedOrDisconnected(num)
  })

  socket.on('check-players', players => {
    players.forEach((p, i) => {
      playersReady[i] = p.ready
      if (p.connected) playerConnectedOrDisconnected(i)
      if (p.ready) playerReady(i)
    })

    startWarMulti()
  })

  socket.on('player-ready', () => {
  players[playerIndex].ready = true
  socket.broadcast.emit('enemy-ready', playerIndex)
})

  socket.on('fire', handleIncomingFire)
  socket.on('fire-reply', handleFireReply)
}

const handleIncomingFire = id => {
  const myBlocks = document.querySelectorAll('#player-1 div')
  const block = myBlocks[id]

  let result = 'miss'

  if (block.classList.contains('taken')) {
    block.classList.add('boom')
    result = 'hit'
  } else {
    block.classList.add('empty')
  }

  socket.emit('fire-reply', { id, result })
  currentPlayer = 'user'
  startWarMulti()
}

const handleFireReply = ({ id, result }) => {
  const enemyBlocks = document.querySelectorAll('#player-2 div')
  const block = enemyBlocks[id]

  if (result === 'hit') block.classList.add('boom')
  else block.classList.add('empty')

  currentPlayer = 'enemy' 
  startWarMulti()
}




// ready button click
 startButton.onclick = () => {
  if (!allShipsPlaced) {
    info.textContent = 'Deploy all your fleets, private'
    return
  }

  if (!ready) {
    ready = true
    playersReady[playerNum] = true
    socket.emit('player-ready')
    playerReady(playerNum)
  }

  startWarMulti()
}


// setup event listeners for firing 
const getEnemyBoardSelector = () => '#player-2 div'



const enableMultiplayerFiring = () => {
  const enemyBlocks = document.querySelectorAll('#player-2 div')

  enemyBlocks.forEach(block => {
    block.replaceWith(block.cloneNode(true))
  })

  document.querySelectorAll('#player-2 div').forEach(block => {
    block.onclick = () => {
      if (
          gameMode === 'multiPlayer' &&
          currentPlayer === 'user' &&
          ready &&
          playersReady.every(r => r) &&
          !gameOver &&
          !block.classList.contains('boom') &&
          !block.classList.contains('empty')
      )    
 {
        socket.emit('fire', Number(block.id))
        currentPlayer = 'enemy'
        startWarMulti()
      }
    }
  })
}




 const playerConnectedOrDisconnected = (num) => {

        let player = `.p${parseInt(num) + 1 }`
        document.querySelector(`${player} .connected span`).classList.add('green')
        if(parseInt(num) === playerNum)
            document.querySelector(player).style.fontWeight = 'bold'
        
    }
  




//single player
const startSinglePlayer = () => {
 

  ships.forEach(ship => addShipPiece('player-2', ship))

  startButton.addEventListener('click', startWarSingle)
}


// ship selection

let angle = 0
const flip = ()=>{
    
const portShips = Array.from(port.children)
if ( angle === 0){
    angle = 90;
}
else {
    angle= 0
}
portShips.forEach(portShip => portShip.style.transform=`rotate(${angle}deg)`)

}

flipButton.addEventListener('click', flip )

// Creating Boards
 const width = 10;

 const createBoard= (color, user) =>{
    
    const field = document.createElement('div');
    field.classList.add('game-board');
    field.style.backgroundColor = color;
    field.id = user

for(let x = 0; x< width * width; x++ ){
    const block = document.createElement('div');
     block.classList.add('block')
     block.id= x

     field.append(block)
}
    battlefield.append(field)
 }
 
 createBoard('pink', 'player-1');
 createBoard('yellow', 'player-2'); 

 // creating ships

 class Ship{
    constructor(name , length){
        this.name= name
        this.length = length
    }
 };
 
 const destroyer = new Ship('destroyer', 2);
 const submarine = new Ship('submarine', 3);
 const cruiser = new Ship('cruiser',3);
 const battleships = new Ship('battleship',4);
 const carrier = new Ship('carrier', 5);
 const titanic = new Ship('titanic', 6);
 
const ships =[destroyer,  cruiser, battleships, carrier, submarine, titanic];

let notDropped;

const handleValidity = (allFieldBlocks, isHorizontal, startIndex, ship)=>{
   let validStart = isHorizontal
  ? (startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length)
      : (startIndex <= width * width - width * ship.length
      ? startIndex
      : startIndex - ship.length * width + width);





   let shipBlocks= [];

    for (let i = 0; i < ship.length; i++){
        
        if (isHorizontal){

           shipBlocks.push(allFieldBlocks[Number(validStart) + i ]);

        } else{

        shipBlocks.push(allFieldBlocks[Number(validStart) + i * width])
   }
}
 
let valid

if(isHorizontal ){
shipBlocks.every((_shipBlock, index)=>
 valid = shipBlocks[0].id % width !== width -(shipBlocks.length - (index+1)))
}
else{
shipBlocks.every((_shipBlock, index)=>
valid = shipBlocks[0].id < 90 + (width * index + 1)
    )
}

const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))

return{shipBlocks, valid, notTaken}

}
 
const addShipPiece = (user, ship, startId) =>{
   
    const allFieldBlocks = document.querySelectorAll(`#${user} div`)

    let randomBoolean = Math.random() < 0.5;

    let isHorizontal = user === 'player-1' ? angle === 0 : randomBoolean;

    let randomStartIndex = Math.floor(Math.random() * width * width);

    let startIndex = startId ? startId: randomStartIndex

  const { shipBlocks, valid, notTaken} = handleValidity(allFieldBlocks, isHorizontal, startIndex, ship)

if ( valid && notTaken){
  shipBlocks.forEach(shipBlock => {
    
    shipBlock.classList.add(ship.name);

    shipBlock.classList.add('taken');
})
}
else{
    if( user === 'player-2') addShipPiece(user, ship)
       else if(user === 'player-1') notDropped = true;
}

}




// drag player ships

let draggedFleet


const dragStart = (e)=>{
    notDropped = false
    draggedFleet = e.target

}

const dragOver = (e)=>{
e.preventDefault()
const ship = ships[draggedFleet.id]
highlightArea(e.target.id, ship )

}

const dropFleet = (e)=>{

    const startId = e.target.id
    const ship = ships[draggedFleet.id]
    addShipPiece('player-1', ship, startId)
    if( !notDropped){
        draggedFleet.remove()
    }
if (!port.querySelector('.storedship')){
    allShipsPlaced = true
    
console.log(allShipsPlaced);
}
}
const portFleets = Array.from(port.children)

portFleets.forEach(portFleet => portFleet.addEventListener('dragstart', dragStart))

const allplayer1Blocks = document.querySelectorAll('#player-1 div');

allplayer1Blocks.forEach(player1Block =>{
    player1Block.addEventListener('dragover', dragOver)
     player1Block.addEventListener('drop', dropFleet)
})

// Add highlight

const highlightArea= (startIndex, ship)=>{
    const allFieldBlocks = document.querySelectorAll('#player-1 div')
    let isHorizontal = angle === 0

    const {shipBlocks, valid, notTaken} = handleValidity(allFieldBlocks, isHorizontal, startIndex, ship )

if(valid && notTaken)

shipBlocks.forEach(shipBlock =>{
   shipBlock.classList.add('hover')
setTimeout(() => {
    shipBlock.classList.remove('hover')
}, 500);

})

}


let gameOver = false




// start Game



let player1Hits = []
let player2Hits  = []
const player1SunkShips = []
const player2SunkShips = []



const enemyGo = (blocks)=>{
    

    if (gameMode === 'multiPlayer') return
    if(!gameOver){
      turn.textContent = ' Enemies Go'
      info.textContent = 'Player 2 is strategizing...'
      
      setTimeout(() => {
 
  
    blocks = Math.floor(Math.random()*width*width)
    
    const allFieldBlocks =  document.querySelectorAll('#player-1 div')
if (allFieldBlocks[blocks].classList.contains('taken') &&
    allFieldBlocks[blocks].classList.contains('boom')){
        enemyGo()
        return;
    }
    
if (allFieldBlocks[blocks].classList.contains('taken') &&
        !allFieldBlocks[blocks].classList.contains('boom')){
        
        allFieldBlocks[blocks].classList.add('boom')
        info.textContent = 'Damage sustained from enemy '
        

    let classes = Array.from(allFieldBlocks[blocks].classList)
       classes = classes.filter(className => className !== 'boom')
       classes = classes.filter(className => className !== 'block')
       classes = classes.filter(className => className !== 'taken')
       player2Hits.push(...classes)
       checkScore('player-2', player2Hits, player2SunkShips)
        }
    

    else {
     info.textContent = 'Enemy Missed '
     allFieldBlocks[blocks].classList.add('empty')
       }
      }, 1500)

      setTimeout(()=>{
      currentPlayer = 'user'
      turn.textContent = ' Your Go'
      info.textContent = 'Player 1 strategizes...'
    const  allFieldBlocks =  document.querySelectorAll('#player-2 div')
    allFieldBlocks.forEach(block => block.addEventListener('click', handleClick))
      },4000)
    
 }
}


const checkScore = (user, userHits, userSunkShips)=>{

const checkShip = (shipName, shipLength)=>{

if( userHits.filter(storedShipName => storedShipName === shipName).length === shipLength )
    
    {

    if(user === 'player-1'){
        player1Hits=  userHits.filter(storedShipName => storedShipName !== shipName)

        info.textContent = ` Enemies ${shipName} has sunken `
    }

 if(user === 'player-2'){
        player2Hits=  userHits.filter(storedShipName => storedShipName !== shipName)

        info.textContent = ` Your ${shipName} has sunken `
    }
      userSunkShips.push(shipName)
}

}

checkShip('destroyer', 2);
checkShip('cruiser', 3);
checkShip('battleship', 4);
checkShip('carrier', 5);
checkShip('submarine', 3);
checkShip('titanic', 6);

console.log('player1Hits', player1Hits)
console.log('player1SunkShips', player1SunkShips)

if(player1SunkShips.length === 6){
    info.textContent = ' All enemies Fleets has beeen decimated. Good work Private, YOU WON!!'
    gameOver = true
}

if(player2SunkShips.length === 6){
    info.textContent = ' All of your Fleets has beeen decimated. Unlucky Private, YOU LOST!!'
    gameOver = true
}

}

const handleClick = (e)=>{
    if (gameMode === 'multiPlayer') return
  if(!gameOver){
    if(e.target.classList.contains('taken')){

        e.target.classList.add('boom')
        info.textContent = 'Hit on enemy confirmed'

        let classes = Array.from(e.target.classList)
       classes = classes.filter(className => className !== 'boom')
       classes = classes.filter(className => className !== 'block')
       classes = classes.filter(className => className !== 'taken')

        player1Hits.push(...classes)
        
        checkScore('player-1', player1Hits, player1SunkShips)
        
  
        }
        
if(! e.target.classList.contains('taken')){

    info.textContent = ' This was a miss, try again Private'
    e.target.classList.add('empty')
}

currentPlayer = 'enemy'

const allFieldBlocks = document.querySelectorAll('#player-2 div')
allFieldBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
if (gameMode === 'singlePlayer') {
  setTimeout(enemyGo, 3000)
}

    }
}

// multi player game logic

const startWarMulti = () => {
  if (gameOver) return

 if (!playersReady.every(r => r)) {
  info.textContent = 'Waiting for both players to be ready...'
  return
}


  if (!window.gameStarted) {
    window.gameStarted = true
    currentPlayer = playerNum === 0 ? 'user' : 'enemy'
  }

  if (currentPlayer === 'user') {
    turn.textContent = 'Your Go'
    enableMultiplayerFiring()
  } else {
    turn.textContent = "Enemy's Go"
  }
}





const playerReady = (num)=>{
    let player = `.p${parseInt(num) + 1}`
    document.querySelector(`${player} .ready span`).classList.add('green')
}

// single player game logic 
const startWarSingle = ()=>{
//if( currentPlayer === ''){
if (port.children.length !=0){

info.textContent= ' Deploy all your fleets, private '

}

else{
    const allFieldBlocks = document.querySelectorAll('#player-2 div')
    allFieldBlocks.forEach(block => block.addEventListener('click', handleClick))

   currentPlayer = 'user'
    turn.textContent = ' Your Go'
    info.textContent = 'Let the war Begin'
}

//}
}


// select player mode
if(gameMode=== 'singlePlayer'){
  startSinglePlayer()
}
else {
  startMultiPlayer()

}
const resetWar = () => {
  // ----- RESET FLAGS -----
  gameOver = false
  ready = false
  allShipsPlaced = false
  currentPlayer = 'user'
  window.gameStarted = false

  player1Hits = []
  player2Hits = []
  player1SunkShips.length = 0
  player2SunkShips.length = 0

  // ----- RESET UI -----
  info.textContent = 'Place your fleets'
  turn.textContent = ''

  // ----- CLEAR BOARDS -----
  document.querySelectorAll('#player-1 div, #player-2 div').forEach(block => {
    block.className = 'block'
  })

  // ----- RESTORE SHIPS -----
port.innerHTML = ''
angle = 0

ships.forEach((ship, index) => {
  const shipDiv = document.createElement('div')

  shipDiv.classList.add(
    'storedship',
    ship.name,
    `${ship.name}-preview`
  )

  shipDiv.id = index
  shipDiv.draggable = true
  shipDiv.style.transform = 'rotate(0deg)'

  shipDiv.addEventListener('dragstart', dragStart)
  port.appendChild(shipDiv)
})


  
  if (gameMode === 'singlePlayer') {
    ships.forEach(ship => addShipPiece('player-2', ship))
  }

 
  if (gameMode === 'multiPlayer' && socket) {
    socket.disconnect()
    socket = null
    startMultiPlayer()
  }
}



resetButton.addEventListener('click',resetWar)
 