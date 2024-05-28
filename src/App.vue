<template>
  <AppHeader
    @toggleMenu="toggleMenu"
    class="sticky top-0 z-10"
    v-if="$route.path !== '/login' && $route.path !== '/register'"
    :user="userStore.user"
    :friends="friends.length"
    :notifications="notifications.length"
  />
  <AppMenu
    class="z-20 mx-auto right-12 top-20 fixed"
    v-if="menuStore.menuOpen"
    :user="userStore.user"
  />
  <RouterView @click="menuStore.menuOpen = false" />
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import AppMenu from "@/components/AppMenu.vue";
import { useMenuStore } from "@/stores/menuStore";
import { useUserStore } from "@/stores/userStore";
import { useFeedPostStore } from "@/stores/feedPostStore";
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

import { getFirestore, getDocs, collection } from "firebase/firestore";
import firebase from "@/includes/firebase";

const menuStore = useMenuStore();
const userStore = useUserStore();
const feedPostStore = useFeedPostStore();
const router = useRouter();
const friends = ref([]);
const notifications = ref([]);

onBeforeMount(async () => {
  if (!userStore.appLoaded) {
    try {
      await userStore.userDocument(router);

      // get numbers of friend request
      if (userStore.userLoggedIn === true) {
        const db = getFirestore(firebase);

        const friendsRef = collection(db, "users", userStore.uid, "friendReq");
        const notificationsRef = collection(db, "users", userStore.uid, "notifications");

        const friendsSnaphot = await getDocs(friendsRef);

        for (let doc of friendsSnaphot.docs) {
          const document = doc.data();
          friends.value.push(document);
        }

        // get numbers of unread notification
        const notificationsSnaphot = await getDocs(notificationsRef);

        for (let doc of notificationsSnaphot.docs) {
          const document = doc.data();
          if (!document.read) {
            notifications.value.push(document);
          }
        }
      }

      await feedPostStore.getFeedPost(userStore);
    } catch (error) {
      console.log(error);
    }
    useUserStore.appLoaded = true;
  }
});

function toggleMenu() {
  menuStore.menuOpen = !menuStore.menuOpen;
}
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
