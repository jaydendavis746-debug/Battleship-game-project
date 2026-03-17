

# 🚢 Battleship — JavaScript Strategy Game

A classic **Battleship game** built with **HTML, CSS, and vanilla JavaScript**, featuring a fully custom drag‑and‑drop ship placement system, ship rotation, turn‑based gameplay, and a CPU opponent. The project also includes an experimental online multiplayer mode built with WebSockets, showcasing early exploration into real‑time game logic.

This project focuses on **pure JavaScript logic**, **DOM manipulation**, and **game state management** — no external libraries were used for drag‑and‑drop, rotation, or CPU behaviour.

---

## 🎮 Features

### 🧩 **Single‑Player Mode**
- Fully interactive drag‑and‑drop ship placement  
- Custom ship rotation logic (no libraries)  
- Turn‑based gameplay  
- Player attacks enemy grid with hit/miss feedback  
- CPU opponent selects tiles using `Math.random()`  
- Win condition triggers when all ships of one side are destroyed  
- Reset button to start a new match  

### 🧠 **CPU Logic**
- Random tile selection for attacks  
- No hit‑mapping or probability logic (intentionally simple)  
- CPU continues attacking until the game ends  

### 🕹️ **Drag & Drop System**
- Built entirely from scratch using:
  - `dragstart`
  - `dragover`
  - `drop`
- Collision detection to prevent illegal placements  
- Visual feedback for valid/invalid positions  

### 🌐 **Experimental Multiplayer Mode**
The landing page includes two buttons:
- **Single Player** — fully functional  
- **Multiplayer** — prototype mode  

Multiplayer uses WebSockets to sync boards between players.  
The board renders and ships can be placed, but the game logic is incomplete, so the match cannot begin.  

This mode remains in the project intentionally to show:
- exploration into real‑time communication  
- willingness to attempt advanced features  
- transparency in development  

---

## 🛠️ Tech Stack

- **HTML**
- **CSS**
- **JavaScript (Vanilla)**
- **WebSockets (experimental multiplayer)**

No external libraries were used for:
- drag‑and‑drop  
- rotation  
- CPU logic  
- board generation  

---

## 📂 Project Structure

```
battleship/
│
├── index.html          # Landing page (single vs multiplayer)
├── singleplayer.html   # Main game page
├── multiplayer.html    # Experimental mode
│
├── css/
│   └── styles.css
│
├── js/

---

## 🚀 How to Play

1. Open the **Single Player** mode  
2. Drag ships onto your board  
3. Rotate ships using the rotate button or key  
4. Press **Start Game**  
5. Select tiles on the enemy board to attack  
6. CPU will take its turn after each move  
7. First to sink all ships wins  
8. Reset to play again  

---

## 🌐 Deployment

Play the game here:  
👉 [battleships](https://jaydendavis746-debug.github.io/Battleship-game-project/)  


---

## 🔮 Future Improvements

- Smarter CPU with hit‑mapping  
- Fully functional multiplayer mode  
- Improved mobile responsiveness  
- Sound effects + animations  
- Ship placement previews  
- Difficulty levels  

---

## 👤 Author

**Jayden Davis**  
GitHub: [@jaydendavis746-debug](https://github.com/jaydendavis746-debug)


