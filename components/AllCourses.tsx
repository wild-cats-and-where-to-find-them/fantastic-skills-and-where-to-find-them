import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import defaultStyles from "../helpers/default-styles";
import React, { useEffect, useState } from "react";
import CourseService from "../services/course-service";
import { Course } from "../helpers/entities";
import CoursePreview from "./CoursePreview";

const AllCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await CourseService.onAllCoursesUpdate(
        false,
        async (courses) => setCourses(courses)
      );
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const registerToCourse = async (id) => {
    await CourseService.registerToCourse(id);
  };

  return (
    <View style={styles.main}>
      <TextInput
        style={defaultStyles.input}
        placeholder="search"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <Text style={defaultStyles.title}>All courses</Text>
      <FlatList
        horizontal
        style={styles.courses}
        data={courses.filter(
          (course) =>
            course.name.toLowerCase().includes(query.toLowerCase()) ||
            course.tags
              .map((tag) => tag.toLowerCase().includes(query.toLowerCase()))
              .some((predicate) => predicate === true)
        )}
        keyExtractor={(course) => course.id}
        renderItem={({ item: course }) => (
          <CoursePreview
            course={course}
            buttonTitle="Enroll"
            buttonAction={() => registerToCourse(course.id)}
          />
        )}
      />
    </View>
  );
};

export default AllCourses;

const styles = StyleSheet.create({
  main: {
    width: "100%",
    paddingHorizontal: 25,
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
