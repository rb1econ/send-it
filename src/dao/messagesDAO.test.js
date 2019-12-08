import { combineLatest, Observable } from "rxjs";
import { CombineLatestOperator } from "rxjs/operators";
import { db } from "../firebase.js";
import messagesDAO from "./messagesDAO";

describe("messagesDAO unit tests", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("loadMessages", () => {
    let testFireMethods;
    beforeEach(() => {
      // stub out firestore methods
      testFireMethods = {
        where: jest.fn(() => testFireMethods),
        orderBy: jest.fn(() => testFireMethods),
        limit: jest.fn(() => Promise.resolve(testFireMethods))
      };
      db.collection = jest.fn(() => testFireMethods);
    });
    it("should return an approriate observable to subscribe to messages", () => {
      const messages$ = messagesDAO.loadMessages(
        "fakeUserId",
        "fakeRecipientId"
      );
      expect(messages$ instanceof Observable).toBe(true);
      expect(db.collection.mock.calls.length).toBe(2);
      expect(db.collection.mock.calls[0]).toEqual(["messages"]);
      expect(db.collection.mock.calls[1]).toEqual(["messages"]);
      expect(testFireMethods.where.mock.calls.length).toBe(4);
      expect(testFireMethods.where.mock.calls[0]).toEqual([
        "userId",
        "==",
        "fakeUserId"
      ]);
      expect(testFireMethods.where.mock.calls[1]).toEqual([
        "recipientId",
        "==",
        "fakeRecipientId"
      ]);
      expect(testFireMethods.where.mock.calls[2]).toEqual([
        "userId",
        "==",
        "fakeRecipientId"
      ]);
      expect(testFireMethods.where.mock.calls[3]).toEqual([
        "recipientId",
        "==",
        "fakeUserId"
      ]);
      expect(testFireMethods.orderBy.mock.calls.length).toBe(2);
      const createdArgs = ["createdAt", "desc"];
      expect(testFireMethods.orderBy.mock.calls).toEqual([
        createdArgs,
        createdArgs
      ]);
      expect(testFireMethods.limit.mock.calls.length).toBe(2);
    });
  });
  describe("add", () => {
    let testFireMethods;
    beforeEach(() => {
      testFireMethods = {
        add: jest.fn(() => Promise.resolve(testFireMethods))
      };
      db.collection = jest.fn(() => testFireMethods);
    });
    it("should call the appropriate firestore methods and return a promise", done => {
      const fakeMessage = { fake: "message", data: "goes here" };
      messagesDAO.add(fakeMessage).then(() => {
        expect(testFireMethods.add.mock.calls).toEqual([[fakeMessage]]);
        expect(db.collection.mock.calls).toEqual([["messages"]]);
        done();
      });
    });
  });
});
