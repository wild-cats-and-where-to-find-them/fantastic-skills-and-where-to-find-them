import { FlatList, StyleSheet, Text, View } from "react-native";
import defaultStyles from "../helpers/default-styles";
import React, { useEffect, useState } from "react";
import CourseService from "../services/course-service";
import CoursePreview from "./CoursePreview";
import { Course } from "../helpers/entities";

const UploadedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await CourseService.onCoursesForTeacherUpdate(
        async (courses) => setCourses(courses)
      );
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <View style={styles.main}>
      <Text style={defaultStyles.title}>My courses</Text>
      <FlatList
        horizontal
        style={styles.courses}
        data={courses}
        keyExtractor={(course) => course.id}
        renderItem={({ item: course }) => (
          <CoursePreview
            course={course}
            buttonTitle="view"
            buttonPath={`course/${course.id}`}
          />
        )}
      />
    </View>
  );
};

export default UploadedCourses;

const styles = StyleSheet.create({
  main: {
    width: "100%",
  },
  courses: {
    width: "100%",
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    marginHorizontal: 15,
    width: 300,
    height: 300,
  },
});
