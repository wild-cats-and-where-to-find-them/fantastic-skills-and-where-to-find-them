import React from "react";
import { View, StyleSheet } from "react-native";
import AddCourse from "./AddCourse";
import UploadedCourses from "./UploadedCourses";

const MyCourses = () => {
  return (
    <View style={styles.main}>
      <UploadedCourses />
      <AddCourse />
    </View>
  );
};

export default MyCourses;

const styles = StyleSheet.create({
  main: {
    width: "100%",
  },
});
