import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  View,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
} from "react-native";
import ChatService from "../services/chat-service";
import { Chat } from "../helpers/entities";
import defaultStyles from "../helpers/default-styles";

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>();
  const [shownChat, setShownChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState<string>("");
  const topicUnsubscribe = useRef(null);

  useEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await ChatService.onChatsForUserUpdate((chats) => {
        setChats(chats);
        setShownChat((shownChat) => {
          if (shownChat !== null) {
            return chats.find((chat) => chat.id === shownChat.id);
          }
          return null;
        });
      });
    })();
    return () => {
      unsubscribe?.();
      topicUnsubscribe.current?.();
    };
  }, []);

  const send = async () => {
    if (shownChat.id === "") {
      const id = await ChatService.createNewTopicChat(query);
      await ChatService.sendMessageToChat(id, message);
      topicUnsubscribe?.current?.();
      topicUnsubscribe.current = await ChatService.onTopicChatUpdate(
        query,
        (chat) => setShownChat(chat)
      );
    } else {
      await ChatService.sendMessageToChat(shownChat.id, message);
    }
    setMessage("");
  };

  const onSearch = async (text) => {
    setQuery(text);
    topicUnsubscribe.current?.();
    topicUnsubscribe.current = await ChatService.onTopicChatUpdate(
      text,
      (chat) => {
        setShownChat(
          chat ??
            ({
              id: "",
              messages: [],
              otherId: "",
              otherUsername: "",
            } as Chat)
        );
      }
    );
  };

  return (
    <View style={styles.main}>
      <TextInput
        style={defaultStyles.input}
        placeholder="search topic"
        value={query}
        onChangeText={(text) => onSearch(text)}
      />
      <View style={styles.chats}>
        <FlatList
          style={styles.conversations}
          data={chats}
          keyExtractor={(chat) => chat.id}
          renderItem={({ item: chat }) => (
            <Pressable
              style={styles.conversation}
              onPress={() => setShownChat(chat)}
            >
              <Text>{chat.otherUsername}</Text>
            </Pressable>
          )}
        />
        {shownChat !== null && (
          <View style={styles.right}>
            <View style={styles.chat}>
              <FlatList
                inverted
                data={shownChat.messages}
                keyExtractor={(message) => message.id}
                renderItem={({ item: message }) => (
                  <View
                    style={[
                      styles.message,
                      message.own ? styles.messageRight : styles.messageLeft,
                    ]}
                  >
                    {!message.own && (
                      <Text style={styles.messageUsername}>
                        {message.username}
                      </Text>
                    )}
                    <Text>{message.text}</Text>
                  </View>
                )}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={defaultStyles.inputTop}
                placeholder="Type a message..."
                value={message}
                onChangeText={(text) => setMessage(text)}
                onSubmitEditing={send}
              />
              <Pressable style={styles.send} onPress={send}>
                <Text>send</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
export default ChatPage;

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
  },
  chats: {
    flex: 1,
    flexDirection: "row",
  },
  conversations: {
    borderRightColor: "black",
    borderRightWidth: 1,
    flex: 1,
  },
  conversation: {
    width: "100%",
    height: 50,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    cursor: "pointer",
  },
  right: {
    flex: 3,
  },
  chat: {
    paddingHorizontal: 15,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    height: 50,
  },
  send: {
    backgroundColor: "salmon",
    cursor: "pointer",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    backgroundColor: "lightgray",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  messageLeft: {
    marginRight: "auto",
  },
  messageRight: {
    marginLeft: "auto",
  },
  messageUsername: {
    fontSize: 10,
    marginBottom: 10,
  },
});
