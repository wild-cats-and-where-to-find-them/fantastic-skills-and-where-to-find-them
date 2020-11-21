import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import * as firebaseAll from "firebase";

export default !firebase.apps.length
  ? firebase.initializeApp({
      apiKey: "AIzaSyBzYb5178RY3yPcOYJCW7cwgH1SkOAG7Ps",
      authDomain: "skills-2b9bd.firebaseapp.com",
      databaseURL: "https://skills-2b9bd.firebaseio.com",
      projectId: "skills-2b9bd",
      storageBucket: "skills-2b9bd.appspot.com",
      messagingSenderId: "552007419391",
      appId: "1:552007419391:web:78b4c66d7c08dedb0193ca",
    })
  : firebase.app();

export const FieldValue = firebaseAll.default.firestore.FieldValue;
