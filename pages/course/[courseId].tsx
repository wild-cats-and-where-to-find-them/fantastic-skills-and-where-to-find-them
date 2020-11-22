import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Video } from "expo-av";
import { Course } from "../../helpers/entities";
import CourseService from "../../services/course-service";
import { useRouter } from "next/router";
import defaultStyles from "../../helpers/default-styles";
import ChatService from "../../services/chat-service";
import { Hoverable } from "react-native-web-hooks";
import Nav from "../../components/Nav";

const CoursePage = ({ courseId }) => {
  const [courseObj, setCourseObj] = useState<{
    course: Course;
    isCreator: boolean;
  } | null>(null);
  const { course, isCreator } = courseObj || {};
  const [question, setQuestion] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const course = await CourseService.getCourse(courseId);
        setCourseObj(course);
        if (course.course.ownRating) {
          setClickedIndex(course.course.ownRating - 1);
        }
      } catch (error) {
        if (error.code === "course/not-enrolled") {
          router.back();
        }
      }
    })();
  }, []);

  if (!courseObj) {
    return <View />;
  }

  const send = async () => {
    await ChatService.sendOrCreate(course.teacherId, question);
    setQuestion("");
  };

  return (
    <>
      <Nav
        items={[
          {
            name: "Home",
            path: "/",
          },
        ]}
      />
      <View style={styles.main}>
        <Text style={defaultStyles.title}>{course.name}</Text>
        <Video
          source={{ uri: course.featuredUrl }}
          style={styles.video}
          shouldPlay
          isLooping
          rate={1.0}
          resizeMode="cover"
          useNativeControls
        />
        {!isCreator && (
          <>
            <Text style={defaultStyles.title}>Rate this course</Text>
            <View style={styles.rating}>
              {[...Array(5)]
                .map((_, index) => index)
                .map((index) => (
                  <Hoverable
                    key={index}
                    onHoverIn={() => setHoveredIndex(index)}
                    onHoverOut={() => setHoveredIndex(-1)}
                  >
                    {(_isHovered) => (
                      <Pressable
                        onPress={() => {
                          setClickedIndex(index);
                          CourseService.rateCourse(course.id, index + 1);
                        }}
                        style={[
                          styles.bullet,
                          (clickedIndex >= index || hoveredIndex >= index) && {
                            backgroundColor: "black",
                          },
                        ]}
                      />
                    )}
                  </Hoverable>
                ))}
            </View>
            <TextInput
              style={[defaultStyles.input, styles.input]}
              placeholder="Something unclear? Ask a question..."
              value={question}
              onChangeText={(text) => setQuestion(text)}
            />
            <Pressable style={defaultStyles.button} onPress={send}>
              <Text>Send</Text>
            </Pressable>
          </>
        )}
      </View>
    </>
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
  rating: {
    flexDirection: "row",
  },
  bullet: {
    width: 25,
    height: 25,
    backgroundColor: "gray",
    borderRadius: 100,
    marginHorizontal: 10,
    cursor: "pointer",
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
