import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Video } from "expo-av";
import { Course } from "../../helpers/entities";
import CourseService from "../../services/course-service";
import { useRouter } from "next/router";
import defaultStyles from "../../helpers/default-styles";
import ChatService from "../../services/chat-service";

const CoursePage = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [question, setQuestion] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const course = await CourseService.getCourse(courseId);
        setCourse(course);
      } catch (error) {
        if (error.code === "course/not-enrolled") {
          router.back();
        }
      }
    })();
  }, []);

  if (!course) {
    return <View />;
  }

  const send = () => ChatService.sendOrCreate(course.teacherId, question);
  return (
    <View style={styles.main}>
      <Text style={defaultStyles.title}>{course.name}</Text>
      <Video
        source={{ uri: course.featuredUrl }}
        style={styles.video}
        shouldPlay
        isLooping
        isMuted={true}
        rate={1.0}
        resizeMode="cover"
        useNativeControls
      />
      <TextInput
        style={[defaultStyles.input, styles.input]}
        placeholder="Something unclear? Ask a question..."
        value={question}
        onChangeText={(text) => setQuestion(text)}
      />
      <Pressable style={defaultStyles.button} onPress={send}>
        <Text>Send</Text>
      </Pressable>
    </View>
  );
};

export default CoursePage;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
  },
  video: {
    width: "50%",
    height: 300,
  },
  input: {
    width: 300,
    marginTop: 25,
  },
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { courseId } = context.query;
  return {
    props: {
      courseId,
    },
  };
};
