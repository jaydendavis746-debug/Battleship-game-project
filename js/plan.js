
//----------------------------------------------------------------------BattleShips-----------------------------------------------------------------------------------------

/*                                                                           
                                                                     User Stories

As a player , I want to be able to see the layout of my ships.
As a player , my opponents board should not be revealed to me.
As a player , my board should not be revealed to my opponent.
As a player , I want be able to click a on square so that I can attempt a hit.
As a player , I want be able to see confirmation on wether it was a hit or miss.
AS a player , I want to see which  squre my oponent slected for a hit.
As a player , I want be able to see wether my own ships has been hit .
As a player , I want be able to see a timer so that my oponent cannot be AFK and instead pass their turn.
As a player , I want be able to see a clear indicator on whose turn it is .
As a player , I want be able to a winner/loser message to the relevant player .
As a player , I want be able to ahve the option to restart the game so that I can play again .

*/


/*                               
                                                                   Pseudocode
. A functioning start button
. A function reset button 
. Two on screen boards 
. Only the players board should be visible to themselves 
. user should be able to click an opponent square to select a hit
. Add an eventlistener to squares with sips 
. Add an eventlistener to squares without ships
. IF user clicks a square on the opponents board trigger a hit condition
. IF user misses a ship then change the turn of the players
. IF ship is hit or missed show a specific visual confirmation
. IF a ship part has been hit permenalty reveal it position on board
. After a square has been hit make it unable to be selected again and clear indicator for the player that it has been previuosly chosen 
. Computer randomises the ships positioing on the board
. To be able to switch whose turn it is 
. WHILE its  a players turn have a timer 
. IF timer hits 0 change turns
. IF a player Destroys all of their opponents Ships then that player wins 

*/