import firebase, { FieldValue } from "../helpers/firebase";
import AuthService from "./auth-service";
import { v4 as uuidv4 } from "uuid";
import { Course } from "../helpers/entities";

export default class CourseService {
  static async uploadCourse(uri: string, name: string, tags: string[]) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const teacherId = await AuthService.getUserID();
    const uuid = uuidv4();
    const ref = await firebase
      .storage()
      .ref()
      .child(`courses/${teacherId}/${uuid}`);
    await ref.put(blob);
    const url = await ref.getDownloadURL();
    await firebase
      .firestore()
      .collection("courses")
      .doc(uuid)
      .set({ name, tags, videoUrls: [url], featuredUrl: url, teacherId });
  }

  static async onCoursesForTeacherUpdate(
    callback: (courses: Course[]) => void
  ) {
    const teacherId = await AuthService.getUserID();
    return firebase
      .firestore()
      .collection("courses")
      .where("teacherId", "==", teacherId)
      .onSnapshot((snapshot) => {
        callback(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Course))
        );
      });
  }

  static async onAllCoursesUpdate(
    enrolled: boolean,
    callback: (courses: Course[]) => void
  ) {
    const userId = await AuthService.getUserID();
    return firebase
      .firestore()
      .collection("courses")
      .where("teacherId", "not-in", [userId])
      .onSnapshot((snapshot) => {
        callback(
          snapshot.docs
            .filter((doc) => {
              const flag = doc.data().participants?.includes(userId);
              return enrolled ? flag : !flag;
            })
            .map((doc) => ({ ...doc.data(), id: doc.id } as Course))
        );
      });
  }

  static async registerToCourse(id: string) {
    const userId = await AuthService.getUserID();
    await firebase
      .firestore()
      .collection("courses")
      .doc(id)
      .update({
        participants: FieldValue.arrayUnion(userId),
      });
  }

  static async getCourse(id: string) {
    const userId = await AuthService.getUserID();
    const doc = await firebase.firestore().collection("courses").doc(id).get();
    if (!doc.data().participants?.includes(userId)) {
      const error = new Error() as any;
      error.code = "course/not-enrolled";
      throw error;
    }
    return { ...doc.data(), id: doc.id } as Course;
  }
}
