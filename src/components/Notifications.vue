<template>
  <div class="flex items-center gap-4" v-if="loading">
    <div class="w-20 h-20 bg-gray-50 rounded-full"></div>
    <div class="w-full h-10 bg-gray-50 w-full"></div>
  </div>
  <div class="flex items-center p-3 gap-4 bg-gray-100 rounded mb-3">
    <div class="w-20 h-20">
      <img :src="dp" class="rounded-full" />
    </div>
    <div>
      <p class="font-semibold cursor-pointer hover:text-blue-600" @click.prevent="markAsRead">
        {{ notification.message }}
      </p>
      <small>{{ !notification.read ? "unread" : "read" }}</small>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import firebase from "@/includes/firebase";
import { computed } from "vue";

const props = defineProps(["notification", "loading"]);

const userStore = useUserStore();
const router = useRouter();

const dp = computed(() => {
  if (!props.notification.dp && props.notification.gender == "female") {
    return userStore.female_dp;
  } else if (!props.notification.dp && props.notification.gender == "male") {
    return userStore.male_dp;
  } else {
    return props.notification.dp;
  }
});

async function markAsRead() {
  const db = getFirestore(firebase);

  await updateDoc(doc(db, "users", userStore.uid, "notifications", props.notification.id), {
    read: true
  });

  router.push({
    name: "discover-profile",
    params: { profile_id: props.notification.profile_id }
  });
}
</script>
