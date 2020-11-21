import React from "react";
import { Course } from "../helpers/entities";
import { Video } from "expo-av";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Link from "next/link";

const CoursePreview = ({
  course,
  buttonTitle,
  buttonAction,
  buttonPath,
}: {
  course: Course;
  buttonTitle: string;
  buttonAction?: () => void;
  buttonPath?: string;
}) => {
  return (
    <View style={styles.course}>
      <Video
        source={{ uri: course.featuredUrl }}
        style={styles.video}
        shouldPlay
        isLooping
        isMuted={true}
        rate={1.0}
        resizeMode="cover"
      />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>
          {course.name}
          {!isNaN(course.ratingAverage) &&
            ` - ${course.ratingAverage.toFixed(2)}⭐️`}
        </Text>
      </View>
      <View style={styles.tagsContainer}>
        {course.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text>{tag}</Text>
          </View>
        ))}
      </View>
      {(() => {
        const inner = (
          <View style={styles.button}>
            <Text>{buttonTitle}</Text>
          </View>
        );
        return buttonPath ? (
          <Link href={buttonPath}>{inner}</Link>
        ) : (
          <Pressable onPress={buttonAction} style={styles.button}>
            {inner}
          </Pressable>
        );
      })()}
    </View>
  );
};

export default CoursePreview;

const styles = StyleSheet.create({
  course: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  video: {
    marginHorizontal: 15,
    width: 300,
    height: 300,
  },
  nameContainer: {
    width: "100%",
    height: 30,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    borderTopColor: "black",
    borderTopWidth: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "salmon",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  tagsContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignSelf: "flex-start",
  },
  tag: {
    backgroundColor: "lightgray",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    padding: 5,
  },
});
