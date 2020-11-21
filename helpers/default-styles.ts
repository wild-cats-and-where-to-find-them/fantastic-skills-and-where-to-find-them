import { StyleSheet } from "react-native";

const defaultStyles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: "100%",
  },
  inputTop: {
    height: 50,
    borderTopColor: "black",
    borderTopWidth: 1,
    width: "100%",
  },
  button: {
    backgroundColor: "salmon",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
    borderRadius: 20,
    cursor: "pointer",
  },
  title: {
    marginVertical: 25,
    marginHorizontal: 15,
    fontWeight: "bold",
    fontSize: 20,
  },
  subtitle: {
    marginVertical: 15,
    fontSize: 17.5,
  },
});

export default defaultStyles;
