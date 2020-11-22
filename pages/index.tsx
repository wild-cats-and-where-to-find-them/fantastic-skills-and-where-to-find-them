import React, { useEffect, useState } from "react";
import AuthService from "../services/auth-service";
import Nav from "../components/Nav";
import { Image, StyleSheet, View } from "react-native";
import EnrolledCourses from "../components/EnrolledCourses";
import AllCourses from "../components/AllCourses";
import MyCourses from "../components/MyCourses";
import Chat from "../components/Chat";

const Index = () => {
  const [currentView, setCurrentView] = useState("enrolled");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const isLoggedIn = await AuthService.isLoggedIn();
      setIsLoggedIn(isLoggedIn);
    })();
  }, []);

  if (isLoggedIn === null) {
    return <View />;
  }

  if (isLoggedIn === false) {
    return (
      <>
        <Nav
          items={[
            {
              name: "Login/Register",
              path: "/auth",
            },
          ]}
          noLogout
        />
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={{
            uri:
              "https://firebasestorage.googleapis.com/v0/b/skills-2b9bd.appspot.com/o/first_page.png?alt=media&token=65a8108a-1b34-485e-835a-7f23f3ea8cd4",
          }}
        />
      </>
    );
  }

  return (
    <>
      <Nav
        items={[
          {
            name: "Chat",
            onPress: () => setCurrentView("chat"),
          },
          {
            name: "My board",
            onPress: () => setCurrentView("enrolled"),
          },
          {
            name: "All courses",
            onPress: () => setCurrentView("all"),
          },
          {
            name: "My courses",
            onPress: () => setCurrentView("my"),
          },
        ]}
      />
      <View style={styles.main}>
        {(() => {
          switch (currentView) {
            case "chat":
              return <Chat />;
            case "enrolled":
              return <EnrolledCourses />;
            case "all":
              return <AllCourses />;
            case "my":
              return <MyCourses />;
            default:
              return false;
          }
        })()}
      </View>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
