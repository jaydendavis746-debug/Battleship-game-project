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

console.log('hello world')
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
let playerTurn

// start Game

const handleClick = (e)=>{
    
    if(!gameOver){
        if(e.target.classList.contains('taken')){

            e.target.classList.add('boom')
            info.textContent = 'Hit on enemy confirmed'
        }
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

