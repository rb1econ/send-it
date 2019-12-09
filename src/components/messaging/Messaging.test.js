import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
// import "@testing-library/jest-dom/extend-expect";
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

describe("Messaging component", () => {
  const testUser = { username: "Test User One", id: "testUserId1" };
  const testRecipient = { username: "Test User Two", id: "testUserId2" };
  const userRecipient = { user: testUser, recipient: testRecipient };
  describe("messages useEffect and listing", () => {
    it("should flatten and sort the array or messages", async () => {
      messagesDAO.add = jest.fn(() => Promise.resolve());
      const messageThree = {
        id: "messageId3",
        text: "third message",
        createdAt: new Date()
      };
      const messageOne = {
        id: "messageId1",
        text: "first message",
        createdAt: moment(new Date())
          .subtract(3, "hour")
          .toDate()
      };
      const messageTwo = {
        id: "messageId2",
        text: "second message",
        createdAt: moment(new Date())
          .subtract(2, "hour")
          .toDate()
      };

      // mocking out combineLatest implementation
      const messageData = [[messageTwo], [messageOne, messageThree]];
      messagesDAO.loadMessages = jest.fn(() => {
        return {
          subscribe: cb => {
            cb(messageData);
            return { unsubscribe: () => {} };
          }
        };
      });
      let container;
      act(() => {
        container = render(<Messaging {...userRecipient} />);
      });
      const messageList = await container.getAllByTestId("message-li");
      expect(messageList.length).toBe(3);
      expect(messageList[0].textContent.includes(messageOne.text)).toBe(true);
      expect(messageList[1].textContent.includes(messageTwo.text)).toBe(true);
      expect(messageList[2].textContent.includes(messageThree.text)).toBe(true);
    });
  });
  describe("sending and recieving messages", () => {
    const testText = "this is message text";
    beforeEach(() => {
      messagesDAO.add = jest.fn(() => Promise.resolve());
      messagesDAO.loadMessages = jest.fn(() => combineLatest(new Observable()));
    });
    it("should enable the Send It button when text is present in input", async () => {
      let container;
      act(() => {
        container = render(<Messaging {...userRecipient} />);
      });
      expect(container.getByText("SEND IT").disabled).toBe(true);
      act(() => {
        fireEvent.change(
          container.getByLabelText(
            `Message to ${userRecipient.recipient.username}:`
          ),
          {
            target: { value: testText }
          }
        );
      });

      const sendButton = container.getByTestId("send-it");
      expect(sendButton.disabled).toBe(false);
    });
    it("should call messagesDAO appropriately when the Send It button is clicked", async () => {
      let container;
      act(() => {
        container = render(<Messaging {...userRecipient} />);
      });
      act(() => {
        fireEvent.change(
          container.getByLabelText(
            `Message to ${userRecipient.recipient.username}:`
          ),
          {
            target: { value: testText }
          }
        );
      });
      act(() => {
        fireEvent.click(container.getByTestId("send-it"));
      });
      expect(messagesDAO.add.mock.calls.length).toBe(1);
      const addArg = messagesDAO.add.mock.calls[0][0];
      expect(addArg.createdAt instanceof Date).toBe(true);
      expect(typeof addArg.id).toBe("string");
      delete addArg.id;
      delete addArg.createdAt;
      expect(addArg).toEqual({
        text: testText,
        userId: testUser.id,
        recipientId: testRecipient.id
      });
      delete expect(
        await wait(
          () =>
            container.getByLabelText(
              `Message to ${userRecipient.recipient.username}:`
            ).value
        )
      ).toBeFalsy();
    });
    it("changing the recipient call unsubscribes from observable and calls loadMessages appropriately", () => {
      const unsubscribeMock = jest.fn();
      const subscribeMock = jest.fn(() => {
        return { unsubscribe: unsubscribeMock };
      });

      messagesDAO.loadMessages = jest.fn(() => {
        return {
          subscribe: subscribeMock
        };
      });

      let container;
      act(() => {
        container = render(<Messaging {...userRecipient} />);
      });
      expect(subscribeMock.mock.calls.length).toBe(1);
      expect(messagesDAO.loadMessages.mock.calls[0]).toEqual([
        userRecipient.user.id,
        userRecipient.recipient.id
      ]);
      expect(unsubscribeMock.mock.calls.length).toBe(0);
      const newRecip = { username: "New Recip", id: "newRecipId" };

      act(() => {
        container.rerender(
          <Messaging {...{ ...userRecipient, recipient: newRecip }} />
        );
      });
      expect(subscribeMock.mock.calls.length).toBe(2);
      expect(messagesDAO.loadMessages.mock.calls[1]).toEqual([
        userRecipient.user.id,
        newRecip.id
      ]);
      expect(unsubscribeMock.mock.calls.length).toBe(1);
    });
  });
});
