<template>
  <article class="shadow-md p-5">
    <figure class="flex items-center gap-5">
      <div class="md:w-32 md:h-32 w-20 h-20">
        <img :src="dp" alt="" class="rounded-full border-solid border-4 border-blue-300" />
      </div>
      <div>
        <figcaption
          class="md:text-4xl text-xl mb-3 cursor-pointer hover:text-blue-600"
          @click.prevent="
            $router.push({
              name: 'discover-profile',
              params: { profile_id: discoverFriends.profile_id }
            })
          "
        >
          {{ discoverFriends.firstName }} {{ discoverFriends.surname }}
        </figcaption>
        <button
          v-if="!req"
          @click.prevent="sendFriendReq(discoverFriends)"
          class="bg-blue-600 py-2 px-4 text-white rounded font-semibold hover:bg-blue-400"
        >
          Add Friend <i class="fas fa-user-plus"></i>
        </button>
        <button
          v-else
          class="bg-gray-300 py-2 px-4 text-black rounded font-semibold hover:bg-gray-200"
          @click.prevent="cancelFriendReq"
        >
          Cancel Request <i class="fas fa-hourglass-half"></i>
        </button>
      </div>
    </figure>
  </article>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { useUserStore } from "@/stores/userStore";
import { useFriendStore } from "@/stores/friendStore";
import firebase from "@/includes/firebase";

const props = defineProps(["discoverFriends"]);
const userStore = useUserStore();
const friendStore = useFriendStore();
const req = ref(false);

const dp = computed(() => {
  if (!props.discoverFriends.dp && props.discoverFriends.gender == "female") {
    return userStore.female_dp;
  } else if (!props.discoverFriends.dp && props.discoverFriends.gender == "male") {
    return userStore.male_dp;
  } else {
    return props.discoverFriends.dp;
  }
});

onMounted(async () => {
  // check if current user is in friendReq list of any user
  const db = getFirestore(firebase);
  const ref = collection(db, "users", props.discoverFriends.userID, "friendReq");

  const snapshot = await getDocs(ref);
  for (let doc of snapshot.docs) {
    const document = doc.data();

    if (document.userID === userStore.uid) {
      req.value = true;
    }
  }
});

// send friend request
async function sendFriendReq(friend) {
  try {
    await friendStore.sendFriendReq(friend, userStore, req);
  } catch (error) {
    console.log(error);
  }
}

async function cancelFriendReq() {
  await friendStore.cancelFriendReq(props.discoverFriends, userStore);

  window.location.reload();
}
</script>
