<template>
  <!--Loading Content-->
  <div class="w-full mx-auto md:w-3/5" v-if="!friendStore.show">
    <article class="w-full p-5 flex flex-col gap-4">
      <!-- Loading content for individual post -->
      <div id="container">
        <div id="detail" class="h-16 bg-gray-100 mb-3 rounded loading-left">
          <!-- Loading post text -->
        </div>

        <div class="h-32 bg-gray-100 mb-3 rounded loading-right">
          <!-- Loading images -->
        </div>
      </div>
    </article>
  </div>

  <div class="p-5 rounded w-full mx-auto md:w-3/5">
    <h1 class="mb-5 font-bold text-2xl" v-if="friendStore.requests.length !== 0">
      Friend Requests
    </h1>
    <FriendRequests
      v-for="request in friendStore.requestsData"
      :key="request.profileID"
      :friendRequest="request"
    />
  </div>
  <hr
    class="my-5"
    v-if="friendStore.requests.length !== 0 && friendStore.discoverFriends.length !== 0"
  />
  <div class="p-5 rounded w-full mx-auto md:w-3/5" v-show="friendStore.show">
    <h1 class="mb-5 font-bold text-2xl" v-if="friendStore.discoverFriends.length !== 0">
      Discover New Friends
    </h1>
    <DiscoverFriends
      v-for="discoverFriend in friendStore.discoverFriends"
      :key="discoverFriend.profileID"
      :discoverFriends="discoverFriend"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useFriendStore } from "@/stores/friendStore";
import { useUserStore } from "@/stores/userStore";
import DiscoverFriends from "@/components/DiscoverFriends.vue";
import FriendRequests from "@/components/FriendRequests.vue";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";

const friendStore = useFriendStore();
const userStore = useUserStore();

onMounted(async () => {
  const db = getFirestore(firebase);

  if (!friendStore.loaded) {
    await friendStore.newFriends(userStore);
    friendStore.requests.forEach(async (request) => {
      const ref = doc(db, "users", request.userID);
      const user = await getDoc(ref);

      friendStore.requestsData.push(user.data());
    });

    friendStore.loaded = true;
  }
});
</script>
