import { combineLatest } from "rxjs";
import { collection } from "rxfire/firestore";
import { map } from "rxjs/operators";
import { db } from "../firebase.js";
const MESSAGES_COLLECTION = "messages";

function loadMessages(userId, recipientId) {
  const sentMessagesRef = db
    .collection(MESSAGES_COLLECTION)
    .where("userId", "==", userId)
    .where("recipientId", "==", recipientId)
    .orderBy("createdAt", "desc")
    .limit(5);

  const recievedMessagesRef = db
    .collection(MESSAGES_COLLECTION)
    .where("userId", "==", recipientId)
    .where("recipientId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(5);

  const sentMessages$ = collection(sentMessagesRef).pipe(
    map(messages => messages.map(m => m.data()))
  );
  const receivedMessages$ = collection(recievedMessagesRef).pipe(
    map(messages => messages.map(m => m.data()))
  );
  // necessary to perform an OR query with firestore:
  return combineLatest(sentMessages$, receivedMessages$);
}
async function add(currentMessage) {
  await db.collection(MESSAGES_COLLECTION).add(currentMessage);
}

const messageDAO = { add, loadMessages };
export default messageDAO;
