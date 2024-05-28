import { defineStore } from "pinia";
import { ref } from "vue";
import { getFirestore, getDocs, collection, getDoc, doc, orderBy, query } from "firebase/firestore";
import { getStorage, ref as firebaseRef, getDownloadURL, listAll } from "firebase/storage";
import firebase from "@/includes/firebase";

export const useFeedPostStore = defineStore("feedPost", () => {
  const feedPosts = ref([]);
  const loading = ref(true);

  async function getFeedPost(userStore) {
    try {
      loading.value = true;
      let friends = [];
      const db = getFirestore(firebase);
      const storage = getStorage();

      await userStore.userDocument();

      const userRef = collection(db, "users", `${userStore.uid}`, "friends");
      const userSnapshot = await getDocs(userRef);

      for (let doc of userSnapshot.docs) {
        const document = doc.data();

        friends.push(document.user_id);
      }

      const ref = query(collection(db, "posts"), orderBy("date", "desc"));

      const snapshot = await getDocs(ref);

      for (let postDoc of snapshot.docs) {
        const document = postDoc.data();
        if (document.userID === userStore.uid || friends.includes(document.userID)) {
          const ref = doc(db, "users", document.userID);

          const snapshot = await getDoc(ref);

          const images = [];

          const storageRef = firebaseRef(storage, `${document.userID}/posts/${postDoc.id}`);

          const lists = (await listAll(storageRef)).items;

          const allLists = Array.from(lists);

          for (let list of allLists) {
            await getDownloadURL(list).then((url) => {
              images.push(url);
            });
          }

          feedPosts.value.push({ user: snapshot.data(), document, images });
        }
      }

      loading.value = false;
    } catch (err) {
      console.log(err);
    }
  }

  return {
    feedPosts,
    loading,
    getFeedPost
  };
});
