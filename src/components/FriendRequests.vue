<template>
  <article class="shadow-md p-5">
    <figure class="flex items-center gap-5">
      <div class="w-32 h-32">
        <img :src="dp" alt="" class="rounded-full border-solid border-4 border-blue-300" />
      </div>
      <div>
        <figcaption
          class="text-4xl mb-3 cursor-pointer hover:text-blue-600"
          @click.prevent="
            $router.push({
              name: 'discover-profile',
              params: { profile_id: friendRequest.profile_id }
            })
          "
        >
          {{ friendRequest.firstName }} {{ friendRequest.surname }}
        </figcaption>

        <button
          class="bg-blue-600 py-2 px-4 text-white rounded font-semibold hover:bg-blue-400 mr-3"
          @click="acceptFriend(friendRequest)"
        >
          Confirm <i :class="!confirm ? 'fas fa-user-plus' : 'fas fa-check'"></i>
        </button>
        <button
          class="bg-gray-300 py-2 px-4 text-black rounded font-semibold hover:bg-gray-200"
          @click="deleteFriendReq(friendRequest)"
        >
          Delete <i class="fas fa-trash"></i>
        </button>
      </div>
    </figure>
  </article>
</template>

<script setup>
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useFriendStore } from "@/stores/friendStore";

const props = defineProps(["friendRequest"]);

const userStore = useUserStore();
const friendStore = useFriendStore();
const confirm = ref(false);

const dp = computed(() => {
  if (!props.friendRequest.dp && props.friendRequest.gender == "female") {
    return userStore.female_dp;
  } else if (!props.friendRequest.dp && props.friendRequest.gender == "male") {
    return userStore.male_dp;
  } else {
    return props.friendRequest.dp;
  }
});

async function acceptFriend(friendReq) {
  await friendStore.acceptFriend(friendReq, confirm, userStore);

  window.location.reload();
}

async function deleteFriendReq(friendReq) {
  await friendStore.deleteFriendReq(friendReq, userStore);

  window.location.reload();
}
</script>
