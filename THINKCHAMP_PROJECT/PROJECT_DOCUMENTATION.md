# Project Documentation & Technical Report
## Internship Project Assignment: Number Guessing Game
**Company:** THINK CHAMP PVT LTD  
**Project:** Number Guessing Game (Console CLI & Web GUI)  
**Language:** Python / JavaScript / HTML / CSS  
**Difficulty:** Beginner  

---

## 1. Executive Summary

This document serves as the official submission report for the **Number Guessing Game** project assignment assigned by **Think Champ Pvt Ltd**.

The solution has been built as a dual-interface application:
1. **Console / Command-Line Interface (CLI)** (`main.py`): A lightweight, robust Python 3 application meeting all baseline requirements and sample program flows.
2. **Graphical User Interface (Web GUI)** (`index.html`, `styles.css`, `script.js`): A modern, interactive web application featuring glassmorphism visuals, sound effects, countdown animations, difficulty selectors, particle effects, and persistent leaderboards.

---

## 2. Requirements & Evaluation Criteria Fulfillment

| Requirement / Criteria | Status | Details & Implementation |
| :--- | :---: | :--- |
| **Random Number Generation** | ✅ Pass | Generates a secret whole number between 1 and 100 (or custom range). |
| **Attempt Limit (7 Attempts)** | ✅ Pass | Players are given exactly 7 attempts in default mode. Attempts countdown after each guess. |
| **High / Low Hints** | ✅ Pass | Evaluates each incorrect guess and outputs `"Too High"` or `"Too Low"`. |
| **Immediate Victory Termination** | ✅ Pass | Displays success message with attempts used and terminates round immediately. |
| **Game Over Handling** | ✅ Pass | Reveals correct number upon reaching max attempts without guessing correctly. |
| **Input Validation** | ✅ Pass | Catches non-numeric inputs, floating-point numbers, empty inputs, and out-of-range values without crashing or penalizing attempts. |
| **Play Again Prompt** | ✅ Pass | Prompts player after game ends to restart or exit. |
| **Bonus Features** | ✅ Pass | Difficulty levels (Easy/Medium/Hard/Custom), Leaderboard score tracking, Web GUI, Web Audio API sound synthesis, and countdown meter. |

---

## 3. Application Architecture & File Structure

```text
THINKCHAMP_PROJECT/
├── main.py                     # Primary Python CLI Game Script
├── test_game.py                # Automated Unit Testing Suite (Python unittest)
├── index.html                  # Web GUI HTML Structure
├── styles.css                  # Modern Dark-Mode Glassmorphic CSS Styling
├── script.js                   # Web GUI State Manager, Sound Synthesizer & LocalStorage
├── README.md                   # Quick Start & User Guide
├── PROJECT_DOCUMENTATION.md    # Complete Submission Project Report
└── ThinkChamp_NumberGuessingGame_Submission.zip # Complete Package Zip
```

---

## 4. Key Logic & Code Explanation

### 4.1 Input Validation Algorithm (`main.py` & `script.js`)
Input validation ensures that invalid entries (strings, empty strings, floats, values out of bounds) do not crash the application or unfairly decrement attempt limits.

```python
def validate_guess(input_str, min_val, max_val):
    input_str = input_str.strip()
    if not input_str:
        return False, None, "Input cannot be empty. Please enter a whole number."
    try:
        val = int(input_str)
    except ValueError:
        return False, None, f"'{input_str}' is not a valid integer."
    if val < min_val or val > max_val:
        return False, None, f"Out of range! Your guess must be between {min_val} and {max_val}."
    return True, val, ""
```

### 4.2 Web Audio API Sound Generator (`script.js`)
Instead of relying on external audio file downloads, audio effects are dynamically synthesized using browser Web Audio API frequency oscillators:
```javascript
function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    // Frequency ramps for Click, High, Low, Win, and Lose tones...
}
```

---

## 5. How to Run the Project

### Running the Python CLI Application
```bash
python main.py
```

### Running the Unit Tests
```bash
python -m unittest test_game.py
```

### Running the Web GUI Interface
Simply double-click `index.html` to open in any web browser, or serve via local HTTP server:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 6. Conclusion
The project satisfies 100% of the core requirements and evaluation criteria specified by **Think Champ Pvt Ltd**, complemented by bonus features and extensive unit testing.
