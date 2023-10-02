<template>
  <AppHeader
    @toggleMenu="toggleMenu"
    class="sticky top-0 z-10"
    v-if="$route.path !== '/login' && $route.path !== '/register'"
    :user="userData.user"
  />
  <AppMenu
    class="z-20 mx-auto right-12 top-20 fixed"
    v-if="menuStore.menuOpen"
    :user="userData.user"
  />
  <RouterView @click="menuStore.menuOpen = false" />
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import AppMenu from "@/components/AppMenu.vue";
import { useMenuStore } from "@/stores/menu.js";
import { useUserStore } from "@/stores/user.js";
import { onBeforeMount, reactive } from "vue";
import { getStorage, ref as firebaseRef, getDownloadURL } from "firebase/storage";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";

const menuStore = useMenuStore();
const userStore = useUserStore();

const userData = reactive({ user: null });

onBeforeMount(async () => {
  try {
    await userStore.userDocument(userData);

    const storage = getStorage();
    const db = getFirestore(firebase);

    const ref = doc(db, "profile-pictures", userStore.uid);

    const snapshot = await getDoc(ref);
    const document = snapshot.data();

    const dp = await getDownloadURL(firebaseRef(storage, document.name));
    userStore.profilePicture = dp;
  } catch (error) {
    console.log(error);
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
