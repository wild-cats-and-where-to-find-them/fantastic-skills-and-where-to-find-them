import React, { useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CourseService from "../services/course-service";
import defaultStyles from "../helpers/default-styles";

const AddCourse = () => {
  const [data, setData] = useState({
    name: "",
    tags: "",
  });
  const [uri, setUri] = useState<string | null>(null);
  const onAttachVideo = async () => {
    const obj = (await DocumentPicker.getDocumentAsync({
      type: "video/*",
    })) as any;
    setUri(obj.uri);
  };

  const upload = async () => {
    await CourseService.uploadCourse(uri, data.name, data.tags.split(" "));
    setData({
      name: "",
      tags: "",
    });
    setUri(null);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.main}>
        <Text style={defaultStyles.title}>Add course</Text>
        {Object.keys(data).map((key) => (
          <TextInput
            key={key}
            placeholder={key === "tags" ? "tags (separated by space)" : key}
            value={data[key]}
            onChangeText={(text) =>
              setData((data) => ({ ...data, [key]: text }))
            }
            style={defaultStyles.input}
          />
        ))}
        <Pressable onPress={onAttachVideo} style={styles.attach}>
          <Text>Attach video {uri !== null ? "(attached)" : ""}</Text>
        </Pressable>
        <Pressable onPress={upload} style={defaultStyles.button}>
          <Text>Upload</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AddCourse;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  main: {
    width: 300,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  attach: {
    height: 50,
    width: "100%",
    alignSelf: "flex-start",
    justifyContent: "center",
    cursor: "pointer",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
});
