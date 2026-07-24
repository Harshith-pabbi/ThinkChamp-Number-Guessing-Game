import unittest
from main import validate_guess, DIFFICULTIES

class TestNumberGuessingGame(unittest.TestCase):

    def test_difficulty_configurations(self):
        """Verify difficulty configurations match specifications."""
        self.assertEqual(DIFFICULTIES['2']['attempts'], 7)
        self.assertEqual(DIFFICULTIES['2']['min'], 1)
        self.assertEqual(DIFFICULTIES['2']['max'], 100)
        
        self.assertEqual(DIFFICULTIES['1']['min'], 1)
        self.assertEqual(DIFFICULTIES['1']['max'], 50)
        
        self.assertEqual(DIFFICULTIES['3']['min'], 1)
        self.assertEqual(DIFFICULTIES['3']['max'], 200)

    def test_valid_integer_guess(self):
        """Test valid numeric guesses within range."""
        is_valid, val, msg = validate_guess("50", 1, 100)
        self.assertTrue(is_valid)
        self.assertEqual(val, 50)
        self.assertEqual(msg, "")

        is_valid, val, msg = validate_guess("1", 1, 100)
        self.assertTrue(is_valid)
        self.assertEqual(val, 1)

        is_valid, val, msg = validate_guess("100", 1, 100)
        self.assertTrue(is_valid)
        self.assertEqual(val, 100)

    def test_non_numeric_input_handling(self):
        """Test non-numeric inputs (letters, special chars, floats)."""
        is_valid, val, msg = validate_guess("abc", 1, 100)
        self.assertFalse(is_valid)
        self.assertIsNone(val)
        self.assertIn("not a valid integer", msg)

        is_valid, val, msg = validate_guess("12.5", 1, 100)
        self.assertFalse(is_valid)

        is_valid, val, msg = validate_guess("!@#$", 1, 100)
        self.assertFalse(is_valid)

    def test_empty_input_handling(self):
        """Test empty string input."""
        is_valid, val, msg = validate_guess("   ", 1, 100)
        self.assertFalse(is_valid)
        self.assertIn("cannot be empty", msg)

    def test_out_of_bounds_guess(self):
        """Test guesses outside the allowed range."""
        is_valid, val, msg = validate_guess("0", 1, 100)
        self.assertFalse(is_valid)
        self.assertIn("Out of range", msg)

        is_valid, val, msg = validate_guess("101", 1, 100)
        self.assertFalse(is_valid)
        self.assertIn("Out of range", msg)

if __name__ == "__main__":
    unittest.main()
