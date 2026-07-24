# Number Guessing Game
### Think Champ Pvt Ltd - Internship Project Assignment

A feature-complete, zero-error Number Guessing Game built in Python (CLI) and HTML/CSS/JavaScript (Interactive Web GUI) according to the project assignment specifications.

---

## 🎯 Features & Criteria Mapping

| Evaluation Criteria | Weightage | Implementation Details |
| :--- | :---: | :--- |
| **Correct Logic (7-attempt limit)** | **30%** | Standard game randomly generates numbers between 1-100 with **exactly 7 attempts**. Custom attempt counters dynamically update after every turn. |
| **Proper Hints & Messages** | **25%** | Provides immediate `"Too High"` or `"Too Low"` feedback. Win message displays attempt count and ends game immediately. Lose message reveals secret number. |
| **Input Validation & Error Handling** | **20%** | Handles non-numeric input (strings, floats, symbols, empty input, out-of-range numbers) gracefully without crashing or penalizing attempt count. |
| **Code Readability & Structure** | **15%** | Modular, well-commented Python script (`main.py`), object-oriented structure, clean CSS design tokens, and modular JS state management. |
| **Bonus Features Implemented** | **10%** | Difficulty levels (Easy, Medium, Hard, Custom), leaderboard & score tracking, modern Web GUI, visual attempt countdown ring, sound synthesizer, and win confetti. |

---

## 🚀 How to Run the Program

### Option 1: Command Line Interface (Python CLI)
Ensure Python 3.x is installed on your system.

1. Open your terminal / command prompt.
2. Navigate to the project directory:
   ```bash
   cd THINKCHAMP_PROJECT
   ```
3. Run the main application:
   ```bash
   python main.py
   ```
4. Follow the interactive prompts:
   - Select difficulty level (1-4) or press `Enter` for standard Medium mode (1-100, 7 attempts).
   - Enter your numerical guesses.
   - View leaderboard & play again options upon completion.

---

### Option 2: Interactive Web Graphical Interface (Web GUI)
The project includes a modern, dark-mode glassmorphic graphical user interface with sound effects and animations.

1. Open `index.html` directly in any standard web browser (Chrome, Edge, Firefox, Safari).
   - Or run a simple local web server:
     ```bash
     python -m http.server 8000
     ```
   - Open `http://localhost:8000` in your web browser.
2. Enjoy interactive difficulty switching, visual countdown ring, guess history list, sound effects, and celebratory victory confetti.

---

## 🧪 Running Automated Unit Tests

Automated unit tests are provided in `test_game.py` to verify input validation, boundary checking, and difficulty settings.

To execute the test suite:
```bash
python -m unittest test_game.py
```

Expected output:
```text
.....
----------------------------------------------------------------------
Ran 5 tests in 0.000s

OK
```

---

## 🎁 Bonus Features Included

1. **Difficulty Selection**:
   - **Easy**: Range 1 – 50 (10 Attempts)
   - **Medium**: Range 1 – 100 (7 Attempts) - *Standard Assignment Default*
   - **Hard**: Range 1 – 200 (5 Attempts)
   - **Custom**: User-defined range and attempt limits.
2. **Leaderboard & Statistics**:
   - Tracks total games played, total wins, win percentage, and best score (fewest attempts) for each difficulty level across rounds.
   - Saved automatically to `leaderboard.json` (CLI) and `localStorage` (Web GUI).
3. **Visual Countdown Meter**:
   - Circular countdown progress ring in the Web UI that turns from cyan to yellow and red as attempts decrease.
4. **Web Audio Synthesizer**:
   - Custom synthesized sound effects for guess submit, high/low hints, victory fanfare, and game over, built natively using the Web Audio API (no external audio assets required).
5. **Interactive Particles (Confetti)**:
   - Dynamic canvas particle explosion upon guessing the correct number.

---

## 📂 Project Structure

```text
THINKCHAMP_PROJECT/
├── main.py              # CLI Game Application (Python)
├── test_game.py         # Unit Tests (Python unittest)
├── index.html           # Graphical Web Interface Layout
├── styles.css           # Glassmorphism Styling & Keyframe Animations
├── script.js            # Web UI Logic, Sound Synthesizer & LocalStorage Stats
├── leaderboard.json     # Generated stats file for CLI
└── README.md            # Project documentation and submission guide
```

---

## ✍️ Author
Submitted for **Think Champ Pvt Ltd Internship Project Assignment**.
