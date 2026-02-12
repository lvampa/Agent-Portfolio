import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReplInput from "../ReplInput";

describe("Repl Input", () => {
  describe("Focus", () => {
    test("should be focused when the page loads", async () => {
      // Arrange
      render(<ReplInput isVisible={true} onSubmit={() => {}} />);

      // Act
      const input = screen.getByLabelText('Input Prompt');

      // Assert
      expect(input).toHaveFocus();
    });

    test("should be focused, even if a user clicks elsewhere on the DOM", async () => {
      // Arrange
      render(<ReplInput isVisible={true} onSubmit={() => {}} />);
      const user = userEvent.setup();

      // Act
      const input = screen.getByLabelText('Input Prompt');
      expect(input).toHaveFocus();
      await user.click(document.body);

      // Assert
      expect(input).toHaveFocus();
    });
  })
});
