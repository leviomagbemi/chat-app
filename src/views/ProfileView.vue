<template>
  <div>
    <!--Loading Content-->
    <div class="p-5 flex-col flex gap-4 md:flex-row" v-if="!userStore.user">
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
        <img class="rounded" :src="dp" alt="" />
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
            {{ userStore.user.firstName }} {{ userStore.user.surname }}
          </h1>
          <p class="text-lg my-3">{{ userStore.user.bio }}</p>

          <button
            class="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
            @click.prevent="editProfile = true"
          >
            <i class="fas fa-edit"></i> Edit Profile
          </button>
        </div>

        <!--Navigation-->
        <hr class="my-3" />
        <div>
          <ul class="flex gap-5 justify-center">
            <li @click="active = 'post'" :class="active === 'post' ? activeState : ''">Post</li>
            <li @click="active = 'friends'" :class="active === 'friends' ? activeState : ''">
              Friends
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <UploadProfilePic v-if="uploadModal" @closeUploadModal="uploadModal = false" />

  <EditProfile
    :editProfile="editProfile"
    class="absolute top-16 left-2/4 z-20"
    style="transform: translateX(-50%)"
    @closeEditModal="editProfile = false"
  />
  <div v-if="editProfile" class="bg-white opacity-50 w-full h-full fixed top-0 z-10"></div>

  <div class="w-full p-2 mx-auto md:max-w-3xl">
    <div v-if="active === 'post'">
      <Posts
        v-for="post in posts"
        :key="post.postID"
        :post="post"
        :loading="loading"
        :firstName="userStore.user.firstName"
        :surname="userStore.user.surname"
        :dp="userStore.user.dp"
        :gender="userStore.user.gender"
      />
    </div>
    <div v-if="active === 'friends'">
      <div>
        <h1 class="text-4xl font-bold">Friends</h1>
      </div>
      <UserFriends v-for="friend in friendsData" :key="friend.profile_id" :friend="friend" />
    </div>
  </div>
  <viewImages v-show="viewImagesStore.viewImages" />
</template>

<script setup>
import UploadProfilePic from "@/components/UploadProfilePic.vue";
import EditProfile from "@/components/EditProfile.vue";
import viewImages from "@/components/viewImages.vue";
import { useUserStore } from "@/stores/user.js";
import { usePostStore } from "@/stores/post.js";
import { useFriendStore } from "@/stores/friend";
import { useViewImagesStore } from "@/stores/viewImages";
import { onBeforeMount, ref, computed } from "vue";
import Posts from "@/components/Posts.vue";
import UserFriends from "@/components/UserFriends.vue";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import firebase from "@/includes/firebase";

const userStore = useUserStore();
const viewImagesStore = useViewImagesStore();
const friendStore = useFriendStore();
const uploadModal = ref(false);
const active = ref("post");
const postStore = usePostStore();
const posts = ref([]);
const loading = ref(false);
const editProfile = ref(false);
const friends = ref([]);
const friendsData = ref([]);

const dp = computed(() => {
  if (!userStore.user.dp && userStore.user.gender == "female") {
    return userStore.female_dp;
  } else if (!userStore.user.dp && userStore.user.gender == "male") {
    return userStore.male_dp;
  } else {
    return userStore.user.dp;
  }
});

onBeforeMount(async () => {
  await postStore.getPosts(posts, loading, userStore);
  await friendStore.userFriends(userStore, friends);

  const db = getFirestore(firebase);

  const ref = collection(db, "users");

  const snapshot = await getDocs(ref);

  // store user details
  for (let doc of snapshot.docs) {
    if (friends.value.includes(doc.id)) friendsData.value.push(doc.data());
  }
});

const activeState = computed(() => {
  return "bg-blue-600 text-white font-semibold rounded px-3 py-2 hover:bg-blue-500";
});
</script>
