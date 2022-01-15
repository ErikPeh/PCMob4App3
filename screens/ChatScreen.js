import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import firebase from "../database/firebaseDB";
import { GiftedChat } from "react-native-gifted-chat";

const db = firebase.firestore().collection("messages");

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const unsubscribe = db
      .orderBy("createdAt", "desc")
      .onSnapshot((collectionSnapshot) => {
        const serverMessages = collectionSnapshot.docs.map((doc) => doc.data());
        setMessages(serverMessages);
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // logged in
        navigation.navigate("Chat", { id: user.id, email: user.email });
      } else {
        // logged out, get kicked back to the login page
        navigation.navigate("Login");
      }
    });

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <MaterialCommunityIcons
            name="logout"
            size={30}
            color="red"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    firebase.auth().signOut();
  };
  const sendMessages = (newMessages) => {
    console.log(newMessages);
    db.add(newMessages[0]);
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => sendMessages(newMessages)}
      renderUsernameOnMessage={true}
      listViewProps={{
        style: {
          backgroundColor: "#666",
        },
      }}
      user={{
        _id: 1,
      }}
    />
  );
};

export default ChatScreen;
