import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  collection,
  where
} from "firebase/firestore";

import firebase from "@/includes/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    userLoggedIn: false,
    uid: "",
    user: null,
    appLoaded: false,
    female_dp: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_female-1024.png",
    male_dp: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male-1024.png"
  }),

  actions: {
    // create user
    async createUser(values) {
      const db = getFirestore(firebase);

      const userCred = getAuth();

      const profile_id = Math.random().toString(16).slice(2);

      const createUser = await createUserWithEmailAndPassword(
        userCred,
        values.email,
        values.password
      );

      await setDoc(doc(db, "users", createUser.user.uid), {
        firstName: values["First Name"],
        surname: values.surname,
        email: values.email,
        dob: values.dob,
        gender: values.gender,
        user_id: createUser.user.uid,
        profile_id
      });
    },

    // sign user in after account creation
    async authenticate(values) {
      const auth = getAuth();

      await signInWithEmailAndPassword(auth, values.email, values.password);

      this.userLoggedIn = true;
    },

    // check if user is logged in
    async checkUser(router) {
      await new Promise((resolve, reject) => {
        getAuth().onAuthStateChanged((user) => {
          if (user) {
            this.uid = user.uid;
            this.userLoggedIn = true;
            resolve();
          } else {
            this.userLoggedIn = false;
            router.push("/login");
            reject();
          }
        });
      });
    },

    // get user document if user is logged in
    async userDocument(router) {
      await this.checkUser(router);

      const db = getFirestore(firebase);

      const ref = doc(db, "users", this.uid);

      const snapshot = await getDoc(ref);
      if (snapshot.exists() && this.userLoggedIn) {
        this.user = snapshot.data();
      } else {
        console.log("No such document");
      }
    },

    //signout user
    async logout() {
      const auth = getAuth();
      await signOut(auth);
      this.userLoggedIn = false;
    }
  }
});
