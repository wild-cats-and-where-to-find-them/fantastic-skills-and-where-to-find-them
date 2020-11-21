// @generated: @expo/next-adapter@2.1.0
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/auth-service";
import Nav from "../components/Nav";
import { StyleSheet, View } from "react-native";
import EnrolledCourses from "../components/EnrolledCourses";
import AllCourses from "../components/AllCourses";
import MyCourses from "../components/MyCourses";
import Chat from "../components/Chat";

const Index = () => {
  const [currentView, setCurrentView] = useState("enrolled");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const isLoggedIn = await AuthService.isLoggedIn();
      if (!isLoggedIn) {
        router.push("/auth");
      }
    })();
  }, []);

  return (
    <>
      <Nav
        items={[
          {
            name: "Chat",
            onPress: () => setCurrentView("chat"),
          },
          {
            name: "Enrolled courses",
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
