<template>
  <div class="p-5 rounded w-full mx-auto md:w-3/5">
    <h1 class="mb-5 font-bold text-2xl">Discover New Friends</h1>
    <article class="shadow-md p-5" v-for="(friend, index) in friends" :key="index">
      <figure class="flex items-center gap-5">
        <div class="w-32 h-32">
          <img
            v-if="friend.dp"
            :src="friend.dp"
            alt=""
            class="rounded-full border-solid border-4 border-blue-300"
          />
          <img
            v-if="friend.gender === 'male' && !friend.dp === ''"
            class="rounded-full"
            src="@/assets/avatar-male.jpg"
            i
            alt=""
          />
          <img
            v-else-if="friend.gender === 'female' && !friend.dp"
            class="rounded-full"
            src="@/assets/avatar-male.jpg"
            i
            alt=""
          />
        </div>
        <div>
          <figcaption
            class="text-4xl mb-3 cursor-pointer hover:text-blue-600"
            @click.prevent="
              $router.push({ name: 'discover-profile', params: { profile_id: friend.profile_id } })
            "
          >
            {{ friend.firstName }} {{ friend.surname }}
          </figcaption>
          <button class="bg-blue-600 py-2 px-4 text-white rounded font-semibold hover:bg-blue-400">
            Add Friend
          </button>
        </div>
      </figure>
    </article>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { useUserStore } from "@/stores/user.js";
import firebase from "@/includes/firebase";

const friends = ref([]);
const userStore = useUserStore();

onBeforeMount(async () => {
  const db = getFirestore(firebase);
  const userRef = collection(db, "users");
  const snapshot = await getDocs(userRef);

  for (let doc of snapshot.docs) {
    const document = doc.data();

    if (userStore.uid !== document.user) {
      friends.value.push(document);
    }
  }
});
</script>
