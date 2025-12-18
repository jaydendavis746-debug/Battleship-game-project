const port = document.querySelector('#port')
const battlefield = document.querySelector('#battlefield')
const flipButton = document.querySelector('#flip')
const startButton = document.querySelector('#start')
const timer = document.querySelector('#timer')
const turn = document.querySelector('#turn')
const info = document.querySelector('#info')


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
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? 
    startIndex: width * width - ship.length:

    //handle vertical

 startIndex <= width * width - width*ship.length ? startIndex: 
 startIndex - ship.length * width + width;

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


ships.forEach(ship => addShipPiece('player-2', ship));

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
let player1Turn



// start Game



let player1Hits = []
let player2Hits  = []
const player1SunkShips = []
const player2SunkShips = []



const player2Go = ()=>{
    if(!gameOver){
      turn.textContent = 'Player 2s turn'
      info.textContent = 'Player 2 is strategizing...'

    setTimeout(() => {
    let randomGo= Math.floor(Math.random()*width*width)
    const  allFieldBlocks =  document.querySelectorAll('#player-1 div')
if (allFieldBlocks[randomGo].classList.contains('taken') &&
    allFieldBlocks[randomGo].classList.contains('boom')){
        player2Go()
        return;
        } 
else if (allFieldBlocks[randomGo].classList.contains('taken') &&
        !allFieldBlocks[randomGo].classList.contains('boom')){
        
        allFieldBlocks[randomGo].classList.add('boom')
        info.textContent = 'Damage sustained from enemy '

    let classes = Array.from(allFieldBlocks[randomGo].classList)
       classes = classes.filter(className => className !== 'boom')
       classes = classes.filter(className => className !== 'block')
       classes = classes.filter(className => className !== 'taken')
       player2Hits.push(...classes)
       checkScore('player-2', player2Hits, player2SunkShips)

             } 
else{
     info.textContent = 'Enemy Missed '
     allFieldBlocks[randomGo].classList.add('empty')
}
      }, 3000)

      setTimeout(()=>{
      player1Turn = true
      turn.textContent = 'Player 1s turn'
      info.textContent = 'Player 1 strategizes...'
    const  allFieldBlocks =  document.querySelectorAll('#player-2 div')
    allFieldBlocks.forEach(block => block.addEventListener('click', handleClick))
      },6000)


    }
}

const checkScore = (user, userHits, userSunkShips)=>{

const checkShip = (shipName, shipLength)=>{

if( userHits.filter(storedShipName => storedShipName === shipName).length === shipLength )
    
    {

    info.textContent = `${user}'s ${shipName} has sunken `

    if(user === 'player-1'){
        player1Hits=  userHits.filter(storedShipName => storedShipName !== shipName)
    }

 if(user === 'player-2'){
        player2Hits=  userHits.filter(storedShipName => storedShipName !== shipName)
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

}

const handleClick = (e)=>{
    
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

player1Turn = false
const allFieldBlocks = document.querySelectorAll('#player-2 div')
allFieldBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
setTimeout(player2Go,3000)
    }
}

const startWar = ()=>{

if (port.children.length !=0){

info.textContent= ' Deploy all your fleets, private '

}

else{
    const allFieldBlocks = document.querySelectorAll('#player-2 div')
    allFieldBlocks.forEach(block => block.addEventListener('click', handleClick))
}

}


startButton.addEventListener('click', startWar)

