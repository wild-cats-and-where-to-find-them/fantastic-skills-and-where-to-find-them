import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Video } from "expo-av";
import { Course } from "../../helpers/entities";
import CourseService from "../../services/course-service";
import { useRouter } from "next/router";
import defaultStyles from "../../helpers/default-styles";

const CoursePage = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
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
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { courseId } = context.query;
  return {
    props: {
      courseId,
    },
  };
};
