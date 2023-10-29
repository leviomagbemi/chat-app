<template>
  <!--Loading Content-->
  <div class="w-full mx-auto md:w-3/5" v-if="!show">
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

  <div class="p-5 rounded w-full mx-auto md:w-3/5" v-if="requests.length !== 0">
    <h1 class="mb-5 font-bold text-2xl">Friend Requests</h1>
    <FriendRequests
      v-for="request in requests"
      :key="request.user.profile_id"
      :friendRequest="request.user"
    />
  </div>
  <hr class="my-5" v-if="requests.length !== 0" />
  <div class="p-5 rounded w-full mx-auto md:w-3/5" v-show="show">
    <h1 class="mb-5 font-bold text-2xl">Discover New Friends</h1>
    <DiscoverFriends
      v-for="discoverFriend in discoverFriends"
      :key="discoverFriend.profile_id"
      :discoverFriends="discoverFriend"
    />
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user.js";
import DiscoverFriends from "@/components/DiscoverFriends.vue";
import FriendRequests from "@/components/FriendRequests.vue";
import { ref, onMounted } from "vue";
import { getFirestore, getDocs, collection } from "firebase/firestore";

import firebase from "@/includes/firebase";
const userStore = useUserStore();
const discoverFriends = ref([]);
const requests = ref([]);
const userfriends = ref([]);
const ids = ref([]);
const show = ref(true);

onMounted(async () => {
  show.value = false;
  const db = getFirestore(firebase);
  const usersRef = collection(db, "users");

  await userStore.userDocument();

  //get user friends
  const userFriendsRef = collection(db, "users", userStore.uid, "friends");

  const userFriendsSnapshot = await getDocs(userFriendsRef);

  for (let doc of userFriendsSnapshot.docs) {
    const document = doc.data();
    userfriends.value.push(document.friend.user);
    console.log(document);
  }

  // fetch users
  const usersSnapshot = await getDocs(usersRef);

  for (let doc of usersSnapshot.docs) {
    //check if current user has friend request
    if (doc.id === userStore.uid) {
      const requestsRef = collection(db, "users", userStore.uid, "friendReq");

      const reqSnapshot = await getDocs(requestsRef);

      for (let doc of reqSnapshot.docs) {
        const document = doc.data();
        requests.value.push(document);
        ids.value.push(document.user.user);
      }
      show.value = true;
    }

    // check if user is not in friend request and add to discover friends
    discoverFriends.value = usersSnapshot.docs
      .map((doc) => doc.data())
      .filter((friend) => {
        return (
          friend.user !== userStore.uid &&
          !ids.value.includes(friend.user) &&
          !userfriends.value.includes(friend.user)
        );
      });
  }
});
</script>
