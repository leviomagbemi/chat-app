<template>
  <div class="w-full mx-auto md:w-3/5 p-5">
    <div v-if="notifications.length == 0 && !loading">
      <h1 class="text-2xl font-bold text-center">No Notifications</h1>
    </div>
    <Notifications
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import Notifications from "@/components/Notifications.vue";
import { ref, onBeforeMount, watchEffect } from "vue";
import { useUserStore } from "@/stores/user.js";
import {
  getFirestore,
  getDocs,
  getDoc,
  doc as userDoc,
  collection,
  query,
  orderBy
} from "firebase/firestore";
import firebase from "@/includes/firebase";

const userStore = useUserStore();
const notifications = ref([]);
const loading = ref(true);

onBeforeMount(async () => {
  loading.value = true;
  watchEffect(() => {
    const db = getFirestore(firebase);
    if (userStore.$state && userStore.uid) {
      const notificationsRef = query(
        collection(db, "users", userStore.uid, "notifications"),
        orderBy("date", "desc")
      );
      getDocs(notificationsRef)
        .then(async (snapshot) => {
          for (let doc of snapshot.docs) {
            const document = doc.data();

            const userRef = userDoc(db, "users", document.user_id);

            const userSnapshot = await getDoc(userRef);

            document.dp = userSnapshot.data().dp;
            document.gender = userSnapshot.data().gender;

            notifications.value.push(document);
          }
        })
        .catch((err) => console.log(err));
    }
  });
  loading.value = false;
});
</script>
