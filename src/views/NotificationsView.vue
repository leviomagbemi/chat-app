<template>
  <div class="w-full mx-auto md:w-3/5 p-5">
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
import { getFirestore, getDocs, collection, query, orderBy } from "firebase/firestore";
import firebase from "@/includes/firebase";

const userStore = useUserStore();
const notifications = ref([]);
const loading = ref(false);

onBeforeMount(async () => {
  watchEffect(() => {
    loading.value = true;
    if (userStore.$state && userStore.uid) {
      const db = getFirestore(firebase);
      const notificationsRef = query(
        collection(db, "users", userStore.uid, "notifications"),
        orderBy("date", "desc")
      );
      getDocs(notificationsRef)
        .then((snapshot) => {
          for (let doc of snapshot.docs) {
            const document = doc.data();
            notifications.value.push(document);
          }
        })
        .catch((err) => console.log(err));
    }
    loading.value = false;
  });
});
</script>
