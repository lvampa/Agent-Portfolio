import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReplInput from "../ReplInput";
import { EVENTS } from "@app/constants/events";

jest.mock("@/lib/event-bus", () => {
  const emit = jest.fn();
  return {
    eventBus: { emit },
    __eventBusMock: { emit },
  };
});

const { __eventBusMock } = jest.requireMock("@/lib/event-bus");
const getEmitMock = () => __eventBusMock.emit as jest.Mock;

describe("ReplInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given the input is visible", () => {
    test("Then it focuses the prompt on first render", () => {
      render(<ReplInput isVisible={true} />);

      const input = screen.getByLabelText('Input Prompt');
      expect(input).toHaveFocus();
    });

    test("When the user clicks elsewhere, Then focus returns to the prompt", async () => {
      render(<ReplInput isVisible={true} />);
      const user = userEvent.setup();
      const input = screen.getByLabelText('Input Prompt');

      await user.click(document.body);
      expect(input).toHaveFocus();
    });

    test("When the user submits text, Then it emits a submit event and clears the input", async () => {
      render(<ReplInput isVisible={true} />);
      const user = userEvent.setup();
      const input = screen.getByLabelText('Input Prompt');

      await user.type(input, "hello{enter}");

      expect(getEmitMock()).toHaveBeenCalledWith(EVENTS.SUBMIT, {
        message: "hello",
        type: EVENTS.SUBMIT,
      });
      expect(input).toHaveValue("");
    });
  });

  describe("Given the input is not visible", () => {
    test("Then it does not render the prompt", () => {
      render(<ReplInput isVisible={false} />);
      expect(screen.queryByLabelText("Input Prompt")).not.toBeInTheDocument();
    });
  });
});
