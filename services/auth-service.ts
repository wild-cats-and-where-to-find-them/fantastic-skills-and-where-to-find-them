import firebase from "../helpers/firebase";

export default class AuthService {
  static login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  static async register(username: string, email: string, password: string) {
    const query = await firebase
      .firestore()
      .collection("users")
      .where("username", "==", username)
      .get();
    if (query.docs.length !== 0) {
      const error = new Error();
      error.message = "The username is already in use";
      throw error;
    }
    const {
      user: { uid },
    } = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await firebase.firestore().collection("users").doc(uid).set({
      username,
      email,
    });
  }

  static async getUser(): Promise<firebase.default.User> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user !== null) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  }

  static async isLoggedIn(): Promise<boolean> {
    try {
      await this.getUser();
      return true;
    } catch {
      return false;
    }
  }

  static async getUserID() {
    const user = await this.getUser();
    return user.uid;
  }

  static logout() {
    return firebase.auth().signOut();
  }
}
