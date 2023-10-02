// import { defineStore } from "pinia";
// import { getFirestore, getDocs, collection, query, where } from "firebase/firestore";
// import { getStorage, ref as firebaseRef, getDownloadURL, listAll } from "firebase/storage";
// import { getAuth } from "firebase/auth";

// import firebase from "@/includes/firebase";

// export const usePostStore = defineStore("posts", {
//   state: () => ({
//     uid: ""
//   }),

//   actions: {
//     async authenticate() {
//       const auth = getAuth();

//       auth.onAuthStateChanged((user) => {
//         this.uid = user.uid;
//       });
//     },

//     async getUserPosts(allLists, images, documentData, posts) {
//       const db = getFirestore(firebase);
//       const storage = getStorage();

//       const ref = collection(db, "posts");
//       const snapshot = await getDocs(ref);
//       console.log(snapshot);

//       for (let doc of snapshot.docs) {
//         const document = doc.data();

//         const storageRef = firebaseRef(storage, `${this.uid}/posts/${document.postID}`);

//         const lists = await listAll(storageRef);
//         console.log(lists);

//         allLists.value.push(Array.from(lists.items));
//         console.log(document);

//         documentData.value.push(document);
//       }

//       console.log(allLists.value);

//       for (let list of allLists.value) {
//         if (list.length > 1) {
//           const dbImg = [];

//           for (let i = 0; i < list.length; i++) {
//             const url = await getDownloadURL(list[i]);
//             dbImg.push(url);
//           }

//           images.value.push(dbImg);
//         }

//         if (list.length === 1) {
//           const url = await getDownloadURL(list[0]);
//           images.value.push([url]);
//         }
//       }

//       for (let i = 0; i < documentData.value.length; i++) {
//         posts.value.push({ document: documentData.value[i], images: images.value[i] });
//       }
//     }
//   }
// });
