<template>
  <section class="pt-5 px-5 max-[600px]:px-3" id="main-sec">
    <CreatePost />
    <main class="bg-white rounded" id="main-content">
      <AllPosts
        v-for="post in posts"
        :key="post.postID"
        :post="post"
        :loading="loading"
        :profilePicture="post.user.dp"
        :firstName="post.user.firstName"
        :surname="post.user.surname"
        :profileID="post.user['profile_id']"
      />
    </main>
  </section>
  <!-- <viewImages v-show="viewImagesStore.viewImages" /> -->
</template>

<script setup>
import AllPosts from "@/components/AllPosts.vue";
import CreatePost from "@/components/CreatePost.vue";
import viewImages from "@/components/viewImages.vue";
import { ref, onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useViewImagesStore } from "@/stores/viewImages";
import { getFirestore, getDocs, collection, getDoc, doc, orderBy, query } from "firebase/firestore";
import { getStorage, ref as firebaseRef, getDownloadURL, listAll } from "firebase/storage";
import firebase from "@/includes/firebase";

const userStore = useUserStore();
const viewImagesStore = useViewImagesStore();
const posts = ref([]);
const loading = ref(false);

onBeforeMount(async () => {
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

      friends.push(document.friend.user);
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

        posts.value.push({ user: snapshot.data(), document, images });
      }
    }

    loading.value = false;
  } catch (err) {
    console.log(err);
  }
});
</script>
