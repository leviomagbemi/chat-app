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
        <img class="rounded" :src="dp" alt="" />
      </div>

      <!--Profile Info-->
      <div class="bg-white p-3 rounded flex-1 gap-4 flex-col text-center md:flex-row md:text-left">
        <div>
          <h1 class="text-4xl font-semibold">
            {{ userProfile.firstName }} {{ userProfile.surname }}
          </h1>
          <p class="text-lg my-3">{{ userProfile.bio }}</p>

          <div class="flex gap-2 self-center justify-center">
            <button
              class="bg-gray-200 p-2 font-semibold rounded hover:bg-gray-300"
              v-if="isFriendReq.length !== 0"
              @click.prevent="cancelFriendReq"
            >
              Cancel Request<i class="fas fa-hourglass-half"></i>
            </button>

            <button
              class="bg-blue-500 text-white p-2 font-semibold rounded hover:bg-blue-600"
              v-if="isFriendReq2.length !== 0"
              @click.prevent="acceptFriend"
            >
              Confirm <i :class="!confirm ? 'fas fa-user-plus' : 'fas fa-check'"></i>
            </button>

            <button
              class="bg-gray-200 p-2 font-semibold rounded hover:bg-gray-300"
              v-if="isFriendReq2.length !== 0"
              @click.prevent="deleteFriendReq"
            >
              Delete <i class="fas fa-trash"></i>
            </button>

            <button
              class="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
              v-if="
                !load &&
                isFriendReq.length === 0 &&
                isFriendReq2.length === 0 &&
                isFriend.length === 0
              "
              @click.prevent="sendFriendReq"
            >
              Add Friend <i class="fas fa-user-plus"></i>
            </button>

            <button
              v-if="isFriend.length !== 0"
              class="bg-blue-500 text-white p-2 mr-3 rounded font-semibold cursor-pointer"
            >
              Friends
            </button>

            <button
              v-if="isFriend.length !== 0"
              class="bg-gray-200 p-2 mr-3 rounded font-semibold cursor-pointer"
            >
              Message <i class="fas fa-envelope"></i>
            </button>
          </div>
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

  <div class="w-full mx-auto md:max-w-3xl">
    <div v-if="active === 'post'">
      <Posts
        v-for="post in posts"
        :key="post.postID"
        :post="post"
        :loading="load"
        :dp="userProfile.dp"
        :firstName="userProfile.firstName"
        :surname="userProfile.surname"
        :gender="userProfile.gender"
      />
    </div>

    <div v-if="active === 'friends'">
      <UserFriends v-for="friend in friendsData" :key="friend.profile_id" :friend="friend" />
    </div>
  </div>
  <viewImages v-show="viewImagesStore.viewImages" />
</template>

<script setup>
import Posts from "@/components/Posts.vue";
import viewImages from "@/components/viewImages.vue";
import UserFriends from "@/components/UserFriends.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user.js";
import { useFriendStore } from "@/stores/friend.js";
import { useViewImagesStore } from "@/stores/viewImages";
import { onBeforeMount, ref, computed } from "vue";
import { getFirestore, getDocs, collection, orderBy, query, where } from "firebase/firestore";
import { getStorage, ref as firebaseRef, getDownloadURL, listAll } from "firebase/storage";
import firebase from "@/includes/firebase";

const active = ref("post");
const route = useRoute();
const userStore = useUserStore();
const friendStore = useFriendStore();
const viewImagesStore = useViewImagesStore();
const posts = ref([]);
const userProfile = ref({});
const load = ref(false);
const isFriend = ref([]);
const isFriendReq = ref([]);
const isFriendReq2 = ref([]);
const friends = ref([]);
const friendsData = ref([]);
const confirm = ref(false);
const req = ref(false);

const dp = computed(() => {
  if (!userProfile.value.dp && userProfile.value.gender == "female") {
    return userStore.female_dp;
  } else if (!userProfile.value.dp && userProfile.value.gender == "male") {
    return userStore.male_dp;
  } else {
    return userProfile.value.dp;
  }
});

onBeforeMount(async () => {
  load.value = true;
  const profileId = route.params.profile_id;
  const db = getFirestore(firebase);
  const storage = getStorage();

  // get user
  const q = query(collection(db, "users"), where("profile_id", "==", profileId));

  const querySnapshot = await getDocs(q);

  // store user details
  for (let doc of querySnapshot.docs) {
    userProfile.value = doc.data();
  }

  //check is friends
  await friendStore.checkFriends(userProfile.value.user_id, isFriend, userStore);

  // get user post with user id
  const ref = query(
    collection(db, "posts"),
    where("userID", "==", userProfile.value.user_id),
    orderBy("time", "desc")
  );

  const postSnapshot = await getDocs(ref);

  for (let doc of postSnapshot.docs) {
    const document = doc.data();

    const images = [];

    const storageRef = firebaseRef(
      storage,
      `${userProfile.value.user_id}/posts/${document.postID}`
    );

    const lists = (await listAll(storageRef)).items;

    const allLists = Array.from(lists);

    for (let list of allLists) {
      await getDownloadURL(list).then((url) => {
        images.push(url);
      });
    }

    posts.value.push({ document, images });
  }

  //check if user is in friendReq list from every user end

  const requestsRef = collection(db, "users", userProfile.value.user_id, "friendReq");

  const requestsRef2 = collection(db, "users", userStore.uid, "friendReq");

  getDocs(requestsRef)
    .then((snapshot) => {
      isFriendReq.value = snapshot.docs
        .map((doc) => doc.data())
        .filter((doc) => {
          return doc.user_id === userStore.uid;
        });
    })
    .catch((err) => console.log(err));

  getDocs(requestsRef2)
    .then((snapshot) => {
      isFriendReq2.value = snapshot.docs
        .map((doc) => doc.data())
        .filter((doc) => {
          return doc.user_id === userProfile.value.user_id;
        });
      load.value = false;
    })
    .catch((err) => console.log(err));

  // Get user friends

  const friendsRef = collection(db, "users", userProfile.value.user_id, "friends");

  const snapshot = await getDocs(friendsRef);

  for (let doc of snapshot.docs) {
    const document = doc.data();
    friends.value.push(document.user_id);
  }

  const usersRef = collection(db, "users");

  const userSnapshot = await getDocs(usersRef);

  // store user details
  for (let doc of userSnapshot.docs) {
    if (friends.value.includes(doc.id) && doc.id != userStore.uid)
      friendsData.value.push(doc.data());
  }
});

async function sendFriendReq() {
  await friendStore.sendFriendReq(userProfile.value, userStore, req);

  window.location.reload();
}

async function acceptFriend() {
  await friendStore.acceptFriend(userProfile.value, confirm, userStore);
}

async function cancelFriendReq() {
  await friendStore.cancelFriendReq(userProfile.value, userStore);

  window.location.reload();
}

async function deleteFriendReq() {
  await friendStore.deleteFriendReq(userProfile.value, userStore);

  window.location.reload();
}

const activeState = computed(() => {
  return "bg-blue-600 text-white font-semibold rounded px-3 py-2 hover:bg-blue-500";
});
</script>
