import React from "react";
import ReactDOM from "react-dom";
import {
  testHook,
  render,
  fireEvent,
  // getByTestId,
  rerender
} from "@testing-library/react";
import App from "./App";

//TODO write beforeEach that mocks the DAO methods (which I should unit test)

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("unit tests", () => {
  // beforeEach(() => {});
  describe("selectUser", () => {
    it("should set the user and display recipient buttons", async () => {
      const container = render(<App />);
      // const userButtons = container.findAllByTestId("user-button");
      // const userButtons2 = container.querySelector("button");
      const userButtons = await container.findAllByTestId("user-button");
      expect(userButtons.length).toBe(3);
      expect(userButtons[0].textContent).toBe("User One");
      expect(userButtons[1].textContent).toBe("User Two");
      expect(userButtons[2].textContent).toBe("User Three");
      fireEvent.click(userButtons[0]);
      const recipientButtons = await container.findAllByTestId(
        "recipient-button"
      );

      expect(recipientButtons.length).toBe(2);
      expect(recipientButtons[0].textContent).toBe("User Two");
      expect(recipientButtons[1].textContent).toBe("User Three");
    });
    it("should take user to Messaging component when user clicks recipient button", () => {
      const container = render(<App />);
      // select user
      fireEvent.click(container.getByText("User One"));
      // select recipient
      fireEvent.click(container.getByText("User Two"));
      expect(container.getByText("Your New Message Here:")).toBeTruthy();
      fireEvent.click(container.getByText("User Three"));
      expect(container.getByText("Your New Message Here:")).toBeTruthy();
    });
  });
});
