import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import firebase from "@/includes/firebase";

export const useUserStore = defineStore("user", () => {
  const userLoggedIn = ref(false);
  const uid = ref("");
  const user = ref(null);
  const appLoaded = ref(false);
  const female_dp = ref(
    "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_female-1024.png"
  );
  const male_dp = ref("https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male-1024.png");

  // create user
  async function createUser(values) {
    const db = getFirestore(firebase);

    const userCred = getAuth();

    const profileID = Math.random().toString(16).slice(2);

    const createNewUser = await createUserWithEmailAndPassword(
      userCred,
      values.email,
      values.password
    );

    await setDoc(doc(db, "users", createNewUser.user.uid), {
      firstName: values["First Name"],
      surname: values.surname,
      email: values.email,
      dob: values.dob,
      gender: values.gender,
      userID: createNewUser.user.uid,
      profileID
    });
  }

  // sign user in after account creation
  async function authenticate(values) {
    const auth = getAuth();

    await signInWithEmailAndPassword(auth, values.email, values.password);

    userLoggedIn.value = true;
  }

  // check if user is logged in
  async function checkUser(router) {
    await new Promise((resolve, reject) => {
      getAuth().onAuthStateChanged((user) => {
        if (user) {
          uid.value = user.uid;
          userLoggedIn.value = true;
          resolve();
        } else {
          userLoggedIn.value = false;
          router.push("/login");
          reject();
        }
      });
    });
  }

  // get user document if user is logged in
  async function userDocument(router) {
    await checkUser(router);

    const db = getFirestore(firebase);

    const ref = doc(db, "users", uid.value);

    const snapshot = await getDoc(ref);
    if (snapshot.exists() && userLoggedIn.value) {
      user.value = snapshot.data();
    } else {
      console.log("No such document");
    }
  }

  //signout user
  async function logout() {
    const auth = getAuth();
    await signOut(auth);
    userLoggedIn.value = false;
  }

  return {
    userLoggedIn,
    uid,
    user,
    appLoaded,
    female_dp,
    male_dp,
    createUser,
    authenticate,
    checkUser,
    userDocument,
    logout
  };
});
