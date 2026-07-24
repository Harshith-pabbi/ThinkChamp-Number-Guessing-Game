import random
import os
import sys
import json
import time

# Enable ANSI colors and UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    os.system("")
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Fallback if coloring is disabled or not supported
def colorize(text, color_code):
    return f"{color_code}{text}{Colors.ENDC}"

DIFFICULTIES = {
    '1': {'name': 'Easy', 'min': 1, 'max': 50, 'attempts': 10},
    '2': {'name': 'Medium (Standard)', 'min': 1, 'max': 100, 'attempts': 7},
    '3': {'name': 'Hard', 'min': 1, 'max': 200, 'attempts': 5}
}

LEADERBOARD_FILE = "leaderboard.json"

def load_leaderboard():
    """Loads leaderboard data from JSON file if available."""
    if os.path.exists(LEADERBOARD_FILE):
        try:
            with open(LEADERBOARD_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {"games_played": 0, "games_won": 0, "best_scores": {}}

def save_leaderboard(data):
    """Saves leaderboard data to JSON file."""
    try:
        with open(LEADERBOARD_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception:
        pass

def validate_guess(input_str, min_val, max_val):
    """
    Validates user guess input.
    Returns (is_valid, parsed_value_or_none, error_message).
    """
    input_str = input_str.strip()
    if not input_str:
        return False, None, "Input cannot be empty. Please enter a whole number."
    
    try:
        val = int(input_str)
    except ValueError:
        return False, None, f"'{input_str}' is not a valid integer. Please enter digits only (e.g. 50)."
    
    if val < min_val or val > max_val:
        return False, None, f"Out of range! Your guess must be between {min_val} and {max_val}."
    
    return True, val, ""

def display_banner():
    banner = f"""
{Colors.OKCYAN}{Colors.BOLD}====================================================
           THINK CHAMP - NUMBER GUESSING GAME
===================================================={Colors.ENDC}
"""
    print(banner)

def select_difficulty():
    """Prompts user to select a difficulty level."""
    print(f"{Colors.BOLD}Select Difficulty Level:{Colors.ENDC}")
    for key, config in DIFFICULTIES.items():
        print(f"  {key}. {config['name']} (Range: {config['min']}-{config['max']}, Attempts: {config['attempts']})")
    print("  4. Custom Mode (Choose your own range and attempts)")
    
    while True:
        choice = input(f"{Colors.BOLD}Enter choice (1-4) [Default: 2]: {Colors.ENDC}").strip()
        if choice == "" or choice == "2":
            return DIFFICULTIES['2']['min'], DIFFICULTIES['2']['max'], DIFFICULTIES['2']['attempts'], "Medium"
        elif choice == "1":
            return DIFFICULTIES['1']['min'], DIFFICULTIES['1']['max'], DIFFICULTIES['1']['attempts'], "Easy"
        elif choice == "3":
            return DIFFICULTIES['3']['min'], DIFFICULTIES['3']['max'], DIFFICULTIES['3']['attempts'], "Hard"
        elif choice == "4":
            return get_custom_difficulty()
        else:
            print(colorize("Invalid option. Please enter 1, 2, 3, or 4.", Colors.WARNING))

def get_custom_difficulty():
    """Allows user to configure custom range and attempts."""
    while True:
        try:
            min_val = int(input("Enter minimum number (e.g. 1): ").strip())
            max_val = int(input("Enter maximum number (e.g. 100): ").strip())
            if min_val >= max_val:
                print(colorize("Maximum number must be greater than minimum number!", Colors.WARNING))
                continue
            attempts = int(input("Enter number of attempts allowed (e.g. 7): ").strip())
            if attempts <= 0:
                print(colorize("Attempts must be at least 1!", Colors.WARNING))
                continue
            return min_val, max_val, attempts, "Custom"
        except ValueError:
            print(colorize("Please enter valid integers for custom settings.", Colors.WARNING))

def update_leaderboard(leaderboard, diff_name, attempts_used, won):
    """Updates leaderboard and persists metrics."""
    leaderboard["games_played"] += 1
    if won:
        leaderboard["games_won"] += 1
        best = leaderboard["best_scores"].get(diff_name)
        if best is None or attempts_used < best:
            leaderboard["best_scores"][diff_name] = attempts_used
            print(colorize(f"[NEW RECORD] NEW PERSONAL BEST for {diff_name} difficulty! ({attempts_used} attempts)", Colors.OKGREEN))
    save_leaderboard(leaderboard)

def show_leaderboard(leaderboard):
    """Displays current stats and leaderboard."""
    print(f"\n{Colors.HEADER}{Colors.BOLD}--- GAME LEADERBOARD & STATS ---{Colors.ENDC}")
    print(f"Total Games Played: {leaderboard['games_played']}")
    print(f"Total Games Won:    {leaderboard['games_won']}")
    win_rate = (leaderboard['games_won'] / leaderboard['games_played'] * 100) if leaderboard['games_played'] > 0 else 0
    print(f"Win Rate:           {win_rate:.1f}%")
    print(f"\n{Colors.BOLD}Best Scores (Fewest Attempts to Win):{Colors.ENDC}")
    if leaderboard.get("best_scores"):
        for mode, score in leaderboard["best_scores"].items():
            print(f"  - {mode}: {score} attempts")
    else:
        print("  No high scores yet! Play a game to set a record.")
    print("-----------------------------------\n")

def play_round(leaderboard):
    """Executes a single round of the Number Guessing Game."""
    min_val, max_val, max_attempts, mode_name = select_difficulty()
    secret_number = random.randint(min_val, max_val)
    attempts_left = max_attempts
    attempts_used = 0

    print(f"\n{Colors.OKBLUE}Welcome to the Number Guessing Game!{Colors.ENDC}")
    print(f"I'm thinking of a number between {min_val} and {max_val}. You have {max_attempts} attempts.\n")

    won = False
    while attempts_left > 0:
        attempts_used += 1
        # Sample prompt flow format matching specification
        prompt_msg = f"Attempt {attempts_used} (Remaining: {attempts_left}): Enter your guess: "
        user_input = input(prompt_msg)
        
        is_valid, guess, error_msg = validate_guess(user_input, min_val, max_val)
        if not is_valid:
            print(colorize(f"  [Input Error]: {error_msg}", Colors.WARNING))
            attempts_used -= 1 # Do not penalize attempt count for invalid input
            continue

        if guess == secret_number:
            print(colorize(f"Attempt {attempts_used}: Enter your guess: {guess} -> Correct! You guessed it in {attempts_used} attempt(s).", Colors.OKGREEN))
            won = True
            break
        elif guess > secret_number:
            attempts_left -= 1
            hint = f"Attempt {attempts_used}: Enter your guess: {guess} -> Too High"
            if attempts_left > 0:
                hint += f" ({attempts_left} attempt(s) left)"
            print(colorize(hint, Colors.FAIL))
        else:
            attempts_left -= 1
            hint = f"Attempt {attempts_used}: Enter your guess: {guess} -> Too Low"
            if attempts_left > 0:
                hint += f" ({attempts_left} attempt(s) left)"
            print(colorize(hint, Colors.WARNING))

    if not won:
        print(f"\n{Colors.FAIL}{Colors.BOLD}GAME OVER! You have used all {max_attempts} attempts.{Colors.ENDC}")
        print(f"The secret number was: {Colors.OKGREEN}{Colors.BOLD}{secret_number}{Colors.ENDC}\n")

    update_leaderboard(leaderboard, mode_name, attempts_used, won)

def main():
    display_banner()
    leaderboard = load_leaderboard()
    
    while True:
        play_round(leaderboard)
        
        # Ask to view leaderboard
        view_stats = input("Would you like to view your Leaderboard & Stats? (y/n) [n]: ").strip().lower()
        if view_stats in ['y', 'yes']:
            show_leaderboard(leaderboard)

        # Play again loop with validation
        while True:
            play_again = input(f"{Colors.BOLD}Do you want to play again? (y/n): {Colors.ENDC}").strip().lower()
            if play_again in ['y', 'yes', 'n', 'no']:
                break
            print(colorize("Please enter 'y' for Yes or 'n' for No.", Colors.WARNING))
        
        if play_again in ['n', 'no']:
            print(f"\n{Colors.OKCYAN}Thanks for playing Think Champ Number Guessing Game! Goodbye!{Colors.ENDC}")
            break

if __name__ == "__main__":
    main()
