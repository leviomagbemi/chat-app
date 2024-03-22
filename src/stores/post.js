import { defineStore } from "pinia";
import {
  getFirestore,
  getDocs,
  collection,
  orderBy,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { getStorage, ref as firebaseRef, getDownloadURL, listAll } from "firebase/storage";
import firebase from "@/includes/firebase";

export const usePostStore = defineStore("posts", {
  actions: {
    async getPosts(posts, loading, userStore) {
      loading.value = true;
      const db = getFirestore(firebase);
      const storage = getStorage();

      await userStore.userDocument();

      const ref = query(
        collection(db, "posts"),
        where("userID", "==", userStore.uid),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(ref);

      for (let doc of snapshot.docs) {
        const document = doc.data();

        const images = [];

        const storageRef = firebaseRef(storage, `${document.userID}/posts/${doc.id}`);

        const lists = (await listAll(storageRef)).items;

        const allLists = Array.from(lists);

        for (let list of allLists) {
          await getDownloadURL(list).then((url) => {
            images.push(url);
          });
        }

        posts.value.push({ document, images });
      }

      loading.value = false;
    },

    async likePost(postLikes, post_id, user) {
      const db = getFirestore(firebase);

      const postRef = doc(db, "posts", post_id);

      if (postLikes.indexOf(user) != -1) {
        //remove like
        postLikes.splice(postLikes.indexOf(user), 1);
        await updateDoc(postRef, {
          likes: arrayRemove(user)
        });
      } else {
        //add like
        postLikes.push(user);
        await updateDoc(postRef, {
          likes: arrayUnion(user)
        });
      }
    }
  }
});
