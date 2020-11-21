import AuthService from "./auth-service";
import firebase, { FieldValue } from "../helpers/firebase";
import { Chat, Message, SidebarChat } from "../helpers/entities";
import { v4 as uuidv4 } from "uuid";

export default class ChatService {
  static async sendOrCreate(to: string, text: string) {
    const userId = await AuthService.getUserID();
    const message = {
      text,
      date: new Date(),
      userId,
      id: uuidv4(),
    };
    const query = await firebase.firestore().collection("chats").get();
    const docs = query.docs.filter(
      (doc) =>
        doc.data().participants.includes(userId) &&
        doc.data().participants.includes(to)
    );
    if (docs.length === 0) {
      await firebase
        .firestore()
        .collection("chats")
        .add({
          participants: [to, userId],
          messages: [message],
        });
    } else {
      await firebase
        .firestore()
        .collection("chats")
        .doc(docs[0].id)
        .update({
          messages: FieldValue.arrayUnion(message),
        });
    }
  }

  static async createNewTopicChat(topic: string) {
    const ref = await firebase.firestore().collection("chats").add({
      topic,
      messages: [],
      participants: [],
    });
    return ref.id;
  }

  static async sendMessageToChat(id: string, text: string) {
    const userId = await AuthService.getUserID();
    const message = {
      text,
      date: new Date(),
      userId,
      id: uuidv4(),
    };
    await firebase
      .firestore()
      .collection("chats")
      .doc(id)
      .set(
        {
          messages: FieldValue.arrayUnion(message),
        },
        { merge: true }
      );
  }

  static async getConversationsForUser() {
    const userId = await AuthService.getUserID();
    const query = await firebase
      .firestore()
      .collection("chats")
      .where("participants", "array-contains", userId)
      .get();
    const data = query.docs.map(async (doc) => {
      const otherId = doc
        .data()
        .participants.filter((participant) => participant !== userId)[0];
      return {
        username: await AuthService.getUsernameById(otherId),
        id: doc.id,
      } as SidebarChat;
    });
    return await Promise.all(data);
  }

  static async onChatsForUserUpdate(callback: (chats: Chat[]) => void) {
    const userId = await AuthService.getUserID();
    return firebase
      .firestore()
      .collection("chats")
      .where("participants", "array-contains", userId)
      .onSnapshot(async (snapshot) => {
        const data = await this.processChatsSnapshot(userId, snapshot, false);
        callback(data);
      });
  }

  static async onTopicChatUpdate(
    topic: string,
    callback: (chat: Chat) => void
  ) {
    const userId = await AuthService.getUserID();
    const query = await firebase
      .firestore()
      .collection("chats")
      .where("topic", "==", topic);
    const docs = await query.get();
    if (docs.docs.length !== 1) {
      callback(null);
      return null;
    }
    return query.onSnapshot(async (snapshot) => {
      const data = await this.processChatsSnapshot(userId, snapshot, true);
      callback(data[0]);
    });
  }

  static async processChatsSnapshot(userId, snapshot, topic): Promise<Chat[]> {
    const convertMessages = async (data) => {
      const username = await AuthService.getUsernameById(data.userId);
      return {
        ...data,
        date: data.date.toDate(),
        username,
        own: data.userId === userId,
      } as Message;
    };
    return await Promise.all(
      snapshot.docs.map(async (doc) => {
        let otherId = null;
        let otherUsername = null;
        if (!topic) {
          otherId = doc
            .data()
            .participants.filter((participant) => participant !== userId)[0];
          otherUsername = await AuthService.getUsernameById(otherId);
        }
        const messages = (await Promise.all(
          doc.data().messages.map((message) => convertMessages(message))
        )) as Message[];
        const delta = (a, b) => b.date - a.date;
        return {
          id: doc.id,
          ...(!topic && {
            otherId,
            otherUsername,
          }),
          otherId,
          otherUsername,
          messages: messages.sort(delta),
        } as Chat;
      })
    );
  }
}
