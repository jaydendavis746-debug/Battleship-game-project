//-----------------------------------------------Grid Creations-----------------------------------------------

const board1= document.querySelector('#board1')

const board2= document.querySelector('#board2')

for(x = 0; x < 100; x++){
let divEl = document.createElement('div');
divEl.classList.add('cell');
divEl.classList.add(x+1)
board1.appendChild(divEl);
}

for(x = 0; x < 100; x++){
let divEl = document.createElement('div');
divEl.classList.add('cell');
divEl.classList.add(x+1)
board2.appendChild(divEl);
}

// Created 64 div elements in each div with the id board 