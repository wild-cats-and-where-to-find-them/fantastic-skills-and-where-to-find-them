import { FlatList, StyleSheet, Text, View } from "react-native";
import defaultStyles from "../helpers/default-styles";
import React, { useEffect, useState } from "react";
import CourseService from "../services/course-service";
import { Course } from "../helpers/entities";
import CoursePreview from "./CoursePreview";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await CourseService.onAllCoursesUpdate(
        true,
        async (courses) => setCourses(courses)
      );
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <View style={styles.main}>
      <Text style={defaultStyles.title}>My board</Text>
      <FlatList
        horizontal
        style={styles.courses}
        data={courses}
        keyExtractor={(course) => course.id}
        renderItem={({ item: course }) => (
          <CoursePreview
            buttonTitle="Go to course"
            buttonPath={`/course/${course.id}`}
            course={course}
          />
        )}
      />
    </View>
  );
};

export default EnrolledCourses;

const styles = StyleSheet.create({
  main: {
    width: "100%",
  },
  courses: {
    width: "100%",
  },
});
