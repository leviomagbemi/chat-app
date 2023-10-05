<template>
  <div>
    <!--Loading Content-->
    <div class="p-5 flex-col flex gap-4 md:flex-row" v-if="!userProfile">
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
          v-if="userProfile.gender === 'male' && userProfile.dp === ''"
          class="rounded"
          src="@/assets/avatar-male.jpg"
          i
          alt=""
        />
        <img
          v-else-if="userProfile.gender === 'female' && userProfile.dp === ''"
          class="rounded"
          src="@/assets/avatar-male.jpg"
          i
          alt=""
        />
        <img v-else class="rounded" :src="userProfile.dp" i alt="" />
      </div>

      <!--Profile Info-->
      <div class="bg-white p-3 rounded flex-1 gap-4 flex-col text-center md:flex-row md:text-left">
        <div>
          <h1 class="text-4xl font-semibold">
            {{ userProfile.firstName }} {{ userProfile.surname }}
          </h1>
          <p class="text-lg my-3">Coding, Programming, web development</p>

          <div class="flex gap-2 self-center text-center">
            <button class="bg-blue-600 text-white p-2 rounded hover:bg-blue-500">
              Add Friend <i class="fas fa-user-plus"></i>
            </button>

            <button class="bg-gray-200 p-2 mr-3 rounded font-semibold cursor-pointer">
              Message <i class="fas fa-envelope"></i>
            </button>
          </div>
        </div>

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

  <div class="w-full mx-auto md:max-w-3xl">
    <Posts
      v-if="active === 'post'"
      :posts="posts"
      :loading="load"
      :profilePicture="userProfile.dp"
    />
  </div>
</template>

<script setup>
import Posts from "@/components/Posts.vue";
import { onBeforeMount, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getFirestore, getDocs, collection, orderBy, query, where } from "firebase/firestore";
import { getStorage, ref as firebaseRef, getDownloadURL, listAll } from "firebase/storage";
import firebase from "@/includes/firebase";

const active = ref("post");
const route = useRoute();
const userProfile = ref({});
const posts = ref([]);
const load = ref(false);

onBeforeMount(async () => {
  load.value = true;
  const profileId = route.params.profile_id;
  const db = getFirestore(firebase);
  const storage = getStorage();

  const q = query(collection(db, "users"), where("profile_id", "==", profileId));

  const ref = query(
    collection(db, "posts"),
    where("profile_id", "==", profileId),
    orderBy("time", "desc")
  );

  const querySnapshot = await getDocs(q);

  for (let doc of querySnapshot.docs) {
    userProfile.value = doc.data();
  }

  const postSnapshot = await getDocs(ref);

  for (let doc of postSnapshot.docs) {
    const document = doc.data();

    const images = [];

    const storageRef = firebaseRef(storage, `${userProfile.value.user}/posts/${document.postID}`);

    const lists = (await listAll(storageRef)).items;

    const allLists = Array.from(lists);

    for (let list of allLists) {
      await getDownloadURL(list).then((url) => {
        images.push(url);
      });
    }

    posts.value.push({ document, images });
  }

  load.value = false;
});

const activeState = computed(() => {
  return "bg-blue-600 text-white font-semibold rounded px-3 py-2 hover:bg-blue-500";
});
</script>
