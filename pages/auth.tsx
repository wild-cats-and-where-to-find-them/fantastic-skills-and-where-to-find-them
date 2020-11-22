import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import AuthService from "../services/auth-service";
import { useRouter } from "next/router";
import defaultStyles from "../helpers/default-styles";
import Nav from "../components/Nav";

const Auth = () => {
  const [authType, setAuthType] = useState<string>("login");

  const router = useRouter();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onPressAuth = async () => {
    try {
      if (authType === "register") {
        await AuthService.register(data.username, data.email, data.password);
      } else {
        await AuthService.login(data.email, data.password);
      }
      await router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Nav items={[]} noLogout />
      <View style={styles.main}>
        <Image
          style={{ width: 300, height: 169 }}
          source={{
            uri:
              "https://firebasestorage.googleapis.com/v0/b/skills-2b9bd.appspot.com/o/create_acc.png?alt=media&token=790855cb-3628-4a0f-bfe3-d85af7e77f82",
          }}
        />
        <View style={styles.authContainer}>
          <Pressable style={styles.authType}>
            <Text style={defaultStyles.title}>
              <Pressable
                style={styles.authOption}
                onPress={() => setAuthType("register")}
              >
                <Text style={authType === "login" && styles.notSelected}>
                  register
                </Text>
              </Pressable>
              /
              <Pressable
                style={styles.authOption}
                onPress={() => setAuthType("login")}
              >
                <Text style={authType === "register" && styles.notSelected}>
                  login
                </Text>
              </Pressable>
            </Text>
          </Pressable>
          {Object.keys(data).map((key) => {
            if (key === "username" && authType === "login") {
              return false;
            }
            return (
              <TextInput
                key={key}
                placeholder={key}
                value={data[key]}
                onChangeText={(text) =>
                  setData((data) => ({ ...data, [key]: text }))
                }
                style={defaultStyles.input}
                secureTextEntry={key === "password"}
              />
            );
          })}
          <Pressable onPress={onPressAuth} style={defaultStyles.button}>
            <Text>{authType}</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default Auth;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  authType: {
    flexDirection: "row",
  },
  notSelected: {
    color: "lightgray",
  },
  authOption: {
    cursor: "pointer",
    marginHorizontal: 15,
  },
});
