import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Repl from "./Repl";

describe("Repl Input", () => {
  test("should be focused, even if a user clicks elsewhere on the DOM", async () => {
    // Arrange
    render(<Repl />);
    const user = userEvent.setup();

    // Act
    const input = screen.getByLabelText('Input Prompt');
    expect(input).toHaveFocus();
    await user.click(document.body);

    // Assert
    expect(input).toHaveFocus();
  });
});
