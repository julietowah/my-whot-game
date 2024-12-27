# Whot Game

## Overview
The Whot Game is a digital implementation of the classic card game "Whot." This project includes a backend to handle game logic and RESTful endpoints, as well as a frontend for user interaction.

---

## Features
- Card game logic implemented in Python.
- RESTful API to manage the game flow.
- Frontend interface for users to play the game.

---

## Project Structure
```
my-whot-game/
|-- Backend/
|   |-- app.py           # Flask server with API endpoints
|   |-- game_logic.py    # Game logic implementation
|   |-- requirements.txt # Backend dependencies
|-- Frontend/
|   |-- what_game/       # Frontend application
|-- .git/                # Git repository metadata
```

### Backend
- **`game_logic.py`**:
  - Implements the core game logic, including card and deck management.
  - Defines game rules for handling player actions.

- **`app.py`**:
  - A Flask-based server that provides endpoints to interact with the game.
  - Key endpoint:
    - `/setup` (POST): Sets up a new game with player names.

### Frontend
- **Components Folder**:
  - Intended for reusable UI components.

---

## Setup and Installation

### Prerequisites
- Python 3.10+
- React (for frontend development)
- Flask and Flask-CORS (for backend development)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-whot-game
   ```

2. Set up the backend:
   ```bash
   cd Backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```
   The backend will start at `http://localhost:5000`.

3. Set up the frontend:
   ```bash
   cd ../Frontend/what_game
   npm install
   npm run dev
   ```
   The frontend will start at `http://localhost:3000`.

---

## Usage
- Navigate to the frontend in your browser.
- Use the interface to set up and play a game.
- The backend manages game logic and updates the frontend dynamically.

---


## Contributions
Contributions are welcome! Feel free to fork this repository and submit pull requests.

