<template>
  <div>
    <!--Loading Content-->
    <div class="p-5 flex-col flex gap-4 md:flex-row" v-if="!userData.user">
      <div class="w-40 h-40 relative mx-auto bg-gray-100 rounded">
        <!--loading Image-->
      </div>
      <div class="bg-white p-3 rounded flex-1 gap-4 flex-col text-center md:flex-row md:text-left">
        <div class="flex-1">
          <div class="h-6 bg-gray-100 rounded loading-left">
            <!--loading username-->
          </div>
          <div class="my-3 h-16 bg-gray-100 rounded loading-right">
            <!--loading about-->
          </div>
          <div class="h-6 bg-gray-100 rounded loading-left">
            <!--Loading edit profile button-->
          </div>
        </div>
      </div>
    </div>

    <!--Main Content-->
    <div class="p-5 flex-col flex gap-4 md:flex-row fade" v-else>
      <!--Profile Image-->
      <div class="w-40 h-40 relative mx-auto">
        <img
          v-if="userData.user.gender === 'male' && userStore.profilePicture === ''"
          class="rounded"
          src="@/assets/avatar-male.jpg"
          i
          alt=""
        />
        <img
          v-else-if="userData.user.gender === 'female' && userStore.profilePicture === ''"
          class="rounded"
          src="@/assets/avatar-male.jpg"
          i
          alt=""
        />
        <img v-else class="rounded" :src="userStore.profilePicture" i alt="" />
        <button
          class="absolute top-32 right-2 inline-block p-5 bg-blue-600 rounded-full text-white text-center hover:bg-blue-500"
          @click="uploadModal = true"
        >
          <i class="fas fa-camera fa-lg"></i>
        </button>
      </div>

      <!--Profile Info-->
      <div class="bg-white p-3 rounded flex-1 gap-4 flex-col text-center md:flex-row md:text-left">
        <div>
          <h1 class="text-4xl font-semibold">
            {{ userData.user.firstName }} {{ userData.user.surname }}
          </h1>
          <p class="text-lg my-3">Coding, Programming, web development</p>
          <!-- <button class="bg-blue-600 text-white p-2 rounded mr-3 hover:bg-blue-500">
          <i class="fas fa-message"></i> Send Message
        </button> -->
          <button class="bg-blue-600 text-white p-2 rounded hover:bg-blue-500">
            <i class="fas fa-edit"></i> Edit Profile
          </button>
        </div>

        <!-- <div class="flex-1 self-center text-center">
        <span class="bg-gray-200 p-5 mr-3 rounded font-semibold cursor-pointer">Friends: 400</span>
        <button class="bg-blue-600 text-white p-4 rounded hover:bg-blue-500">
          Add Friend <i class="fas fa-user-plus"></i>
        </button>
      </div> -->

        <!--Navigation-->
        <hr class="my-3" />
        <div>
          <ul class="flex gap-5 justify-center">
            <li :class="active === 'post' ? activeState : ''">Post</li>
            <li :class="active === 'photos' ? activeState : ''">Photos</li>
            <li :class="active === 'friends' ? activeState : ''">Friends</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <UploadProfilePic v-if="uploadModal" @closeUploadModal="uploadModal = false" />

  <div class="w-full mx-auto md:max-w-3xl">
    <Posts v-if="active === 'post'" />
  </div>
</template>

<script setup>
import UploadProfilePic from "@/components/UploadProfilePic.vue";
import { useUserStore } from "@/stores/user.js";
import { onBeforeMount, reactive, ref, computed } from "vue";
import Posts from "@/components/Posts.vue";

const userStore = useUserStore();
const userData = reactive({ user: null });
const uploadModal = ref(false);
const active = ref("post");

onBeforeMount(async () => {
  await userStore.userDocument(userData);
});

const activeState = computed(() => {
  return "bg-blue-600 text-white font-semibold rounded px-3 py-2 hover:bg-blue-500";
});
</script>
