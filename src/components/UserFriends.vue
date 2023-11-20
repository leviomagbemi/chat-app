<template>
  <article class="shadow-md p-5">
    <figure class="flex items-center gap-5">
      <div class="w-32 h-32">
        <img class="rounded-full" :src="dp" />
      </div>
      <div>
        <figcaption>
          <router-link
            :to="{ name: 'discover-profile', params: { profile_id: friend.friend.profile_id } }"
          >
            <p class="text-xl font-semibold cursor-pointer hover:text-blue-600">
              {{ friend.friend.firstName }} {{ friend.friend.surname }}
            </p>
          </router-link>
        </figcaption>
      </div>
    </figure>
  </article>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getStorage, ref as firebaseRef, getDownloadURL } from "firebase/storage";
import firebase from "@/includes/firebase";

const props = defineProps(["friend"]);
const dp = ref(null);

onBeforeMount(async () => {
  const db = getFirestore(firebase);
  const storage = getStorage();

  const ref = doc(db, "profile-pictures", props.friend.friend.user);

  const snapshot = await getDoc(ref);

  const url = await getDownloadURL(firebaseRef(storage, snapshot.data().name));

  dp.value = url;
});
</script>

<style lang="scss" scoped></style>
