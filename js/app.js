const port = document.querySelector('#port')
const battlefield = document.querySelector('#battlefield')
const flipButton = document.querySelector('#flip')
const startButton = document.querySelector('#start')
const timer = document.querySelector('#timer')
const turn = document.querySelector('turn')


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
 
 createBoard('pink', 'player 1');
 createBoard('red', 'player 2'); 

 // createing ships

 class Ship{
    constructor(name , length){
        thid.name= name
        this.length = length
    }
 }
 
 const destroyer= new Ship('destroyer', 2)