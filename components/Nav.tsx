import { Image, StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import Link from "next/link";
import AuthService from "../services/auth-service";
import { useRouter } from "next/router";
import { useDimensions } from "react-native-web-hooks";

type NavItem = {
  name: string;
  path?: string;
  onPress?: () => void;
};

const Nav = ({ items, noLogout }: { items: NavItem[]; noLogout?: boolean }) => {
  const router = useRouter();
  const {
    window: { width },
  } = useDimensions();
  const isMobile = () => width < 700;

  const _items = [
    ...items,
    !noLogout && {
      name: "Log out",
      onPress: async () => {
        await AuthService.logout();
        router.push("/auth");
      },
    },
  ].filter(Boolean);

  return (
    <View
      style={[
        styles.nav,
        isMobile() && { flexDirection: "column", height: "auto" },
      ]}
    >
      <Image
        source={{
          uri:
            "https://firebasestorage.googleapis.com/v0/b/skills-2b9bd.appspot.com/o/logo.png?alt=media&token=48bc393f-3f3f-4d09-ac30-19a3404d580a",
        }}
        style={styles.logo}
      />
      <View
        style={[
          styles.navItems,
          isMobile() && { width: "100%", flexDirection: "column" },
        ]}
      >
        {_items.map((item) => {
          const inner = (
            <View style={[styles.navItem, isMobile() && { width: "100%" }]}>
              <Text>{item.name}</Text>
            </View>
          );
          return item.path ? (
            <Link key={item.name} href={item.path}>
              {inner}
            </Link>
          ) : (
            <Pressable key={item.name} onPress={item.onPress}>
              {inner}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default Nav;

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    alignItems: "center",
    borderBottomColor: "salmon",
    borderBottomWidth: 1,
  },
  navItems: {
    marginLeft: "auto",
    flexDirection: "row",
  },
  navItem: {
    width: 125,
    height: 50,
    backgroundColor: "salmon",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderLeftColor: "black",
    borderLeftWidth: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
});
