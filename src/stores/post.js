import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user.js";
import { getFirestore, getDocs, collection, orderBy, query } from "firebase/firestore";
import { getStorage, ref as firebaseRef, getDownloadURL, listAll } from "firebase/storage";
import firebase from "@/includes/firebase";

const userStore = useUserStore();

export const usePostStore = defineStore("posts", {
  state: () => ({}),

  actions: {
    async getPosts(posts, loading) {
      loading.value = true;
      const db = getFirestore(firebase);
      const storage = getStorage();

      const ref = query(collection(db, "posts"), orderBy("time", "desc"));

      const snapshot = await getDocs(ref);

      for (let doc of snapshot.docs) {
        const document = doc.data();

        if (userStore.uid === document.user) {
          const images = [];

          const storageRef = firebaseRef(storage, `${userStore.uid}/posts/${document.postID}`);

          const lists = (await listAll(storageRef)).items;

          const allLists = Array.from(lists);

          for (let list of allLists) {
            await getDownloadURL(list).then((url) => {
              images.push(url);
            });
          }

          posts.value.push({ document, images });
        }
      }

      loading.value = false;
    }
  }
});
