import React from "react";
import ReactDOM from "react-dom";
import {
  act,
  testHook,
  render,
  fireEvent,
  // getByTestId,
  rerender,
  wait
} from "@testing-library/react";
// import { act } from "react-dom/test-utils";
import { combineLatest, Observable } from "rxjs";
import messagesDAO from "../../dao/messagesDAO.js";
import { Messaging } from "./Messaging";

const testUser = { username: "Test User One", id: "testUserId1" };
const testRecipient = { username: "Test User Two", id: "testUserId2" };

describe("sending messages", () => {
  beforeEach(() => {
    messagesDAO.add = jest.fn(() => Promise.resolve());
    messagesDAO.loadMessages = jest.fn(() => {
      const a = new Observable();

      return combineLatest(a);
    });
  });
  it("should enable the Send It button when text is present in input", async () => {
    const userRecipient = { user: testUser, recipient: testRecipient };
    let container;
    act(() => {
      container = render(<Messaging {...userRecipient} />);
    });
    expect(container.getByText("SEND IT").disabled).toBe(true);
    act(() => {
      const changeRes = fireEvent.change(
        container.getByLabelText("Your New Message Here:"),
        {
          target: { value: "this is message text" }
        }
      );
      console.log("changeRes", changeRes);
    });

    const sendButton = container.getByTestId("send-it");
    expect(sendButton.disabled).toBe(false);
    act(() => {
      fireEvent.click(container.getByTestId("send-it"));
    });
    expect(messagesDAO.add.mock.calls.length).toBe(1);
    expect(
      await wait(() => container.getByLabelText("Your New Message Here:").value)
    ).toBeFalsy();
  });
  it("should handle change to recipient by unsubscribing to observable and re-subscribing", () => {});
});
