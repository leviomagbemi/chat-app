<template>
  <aside id="aside1" class="bg-white p-5 rounded relative">
    <div class="mb-5">
      <h2 class="text-2xl font-bold">Create A Post</h2>
    </div>
    <div
      id="menu-header"
      class="w-full p-2 rounded bg-white flex gap-4 items-center bg-gray-200 mb-2"
    >
      <!--Profile image-->
      <div>
        <div class="w-14 h-14 bg-gray-100 rounded-full" v-if="!userStore.user">
          <!--loading profile image-->
        </div>

        <div class="w-14 h-14" v-else>
          <img class="rounded-full" :src="dp" alt="" />
        </div>
      </div>

      <!--user name-->
      <div class="flex-1">
        <div v-if="!userStore.user" class="h-5 w-full bg-gray-100 rounded">
          <!--loading user name-->
        </div>
        <div v-else>
          <router-link to="/profile">
            <h4 class="text-xl font-semibold hover:text-blue-600 cursor-pointer">
              {{ userStore.user.firstName }} {{ userStore.user.surname }}
            </h4>
          </router-link>
        </div>
      </div>
    </div>
    <div>
      <form action="" @submit="submitPost">
        <div>
          <div class="flex justify-between mb-3">
            <p>{{ charCount }}</p>
          </div>
          <p v-if="charCount === 0" class="text-red-500 mb-2">
            Text limit exceeded. Please shorten.
          </p>
        </div>

        <textarea
          name="text"
          id="text"
          ref="textField"
          placeholder="Write about Something"
          class="w-full p-2 text-black border-2 border-solid rounded outline-none"
          :class="maxErr"
          @input="checkPost"
        ></textarea>

        <input
          type="file"
          id="fileElem"
          multiple
          accept=".jpg, .jpeg, .png"
          class="visually-hidden"
          name="images"
          @change="loadImage"
        />

        <label
          for="fileElem"
          id="fileElemLabel"
          class="inline-block w-full bg-gray-200 rounded text-center hover:bg-gray-400"
          >Add Images<i class="fas fa-image text-4xl block"></i
        ></label>
        <div class="photo-grid my-3">
          <div v-for="(image, index) in thumbnail" :key="index">
            <img :src="image" alt="" class="w-full grid-item" />
          </div>
        </div>
        <button class="w-full bg-blue-600 rounded text-white font-semibold my-3 py-3">Post</button>
      </form>
    </div>

    <!--overlay-->
    <div
      class="bg-gray-900 absolute top-0 left-0 w-full h-full rounded opacity-75 index-10"
      :style="{ height: overlayHeight + '%' }"
      v-if="loading !== null"
    ></div>

    <!--loading content-->
    <div
      class="mx-auto absolute"
      style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
      v-if="loading !== null"
    >
      <div class="w-20 h-20 border-solid border- rounded-full relative mx-auto">
        <img src="@/assets/loading.gif" class="w-full" v-if="!loading" />
        <img src="@/assets/checkmark.png" class="w-full" v-else />
      </div>

      <p class="text-white text-xl" v-text="!loading ? 'Uploading Post' : 'Post Uploaded'"></p>
    </div>
  </aside>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore";
import { ref, computed } from "vue";
import { getStorage, ref as firebaseRef, uploadBytes } from "firebase/storage";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import firebase from "@/includes/firebase";

const maxErr = ref("");
const maxlength = ref(500);
const charCount = ref(500);
const loading = ref(null);
const images = ref([]);
const thumbnail = ref([]);
const overlayHeight = ref(100);
const textField = ref(null);

const userStore = useUserStore();

const dp = computed(() => {
  if (!userStore.user.dp && userStore.user.gender == "female") {
    return userStore.female_dp;
  } else if (!userStore.user.dp && userStore.user.gender == "male") {
    return userStore.male_dp;
  } else {
    return userStore.user.dp;
  }
});

function loadImage(e) {
  images.value = e.target.files;
  const thumbnailImages = Array.from(images.value);

  for (let image of thumbnailImages) {
    const objectUrl = URL.createObjectURL(image);
    thumbnail.value.push(objectUrl);
  }

  overlayHeight.value = document.getElementById("aside1").offsetHeight;
}

async function submitPost(e) {
  try {
    overlayHeight.value = document.getElementById("aside1").offsetHeight;
    loading.value = false;
    e.preventDefault();

    const form = new FormData(e.target);

    const text = form.get("text") === "" ? " " : form.get("text");

    const db = getFirestore(firebase);

    const postID = Math.random().toString(16).slice(2);

    await setDoc(doc(db, "posts", `${postID}`), {
      text,
      likes: [],
      userID: userStore.uid,
      postID,
      date: serverTimestamp()
    });

    const files = Array.from(images.value);

    const uploadPromises = files.map((file, index) => {
      const storage = getStorage();
      const fileRef = firebaseRef(storage, `${userStore.uid}/posts/${postID}/${index}`);
      return uploadBytes(fileRef, file);
    });

    Promise.all(uploadPromises)
      .then(() => {
        // All uploads are complete.
        setTimeout(() => {
          loading.value = true;
        }, 1000);

        setTimeout(() => {
          loading.value = null;
          location.reload();
        }, 2000);
      })
      .catch((error) => {
        // Handle errors if any of the uploads fail.
        console.error("Upload failed:", error);
      });
  } catch (error) {
    console.log(error);
  }
}

function checkPost(e) {
  // Check if inputType is not a backspace and the character count is not zero
  if (e.inputType !== "deleteContentBackward" && charCount.value !== 0) {
    charCount.value--;
  }

  // Check if inputType is a backspace and increment the character count
  if (e.inputType === "deleteContentBackward") {
    charCount.value++;
  }

  // Check if text was pasted into the input
  if (e.inputType === "insertFromPaste" && e.target.value.length < maxlength.value) {
    // Subtract the length of the pasted text from the character count
    charCount.value -= e.target.value.length;
  } else if (e.inputType === "insertFromPaste" && e.target.value.length >= maxlength.value) {
    // If the pasted text exceeds the maximum length, set character count to 0
    charCount.value = 0;
  }

  // Check if text was cut into the input
  if (e.inputType === "deleteByCut") {
    charCount.value = maxlength.value - e.target.value.length;
  }

  // Check if input is empty
  if (e.target.value === "") {
    charCount.value = maxlength.value;
  }

  // Display an error if the user reaches the text limit
  if (charCount.value === 0 || charCount.value < 0) {
    maxErr.value = "border-solid border-red-500 border-2 rounded";
  }

  // Cut incoming text if the user reaches the text limit
  if (e.target.value.length > maxlength.value) {
    const newVal = e.target.value.slice(0, maxlength.value);
    e.target.value = newVal;
  }

  // Remove error if text is less than text limit
  if (e.target.value.length < maxlength.value) {
    maxErr.value = "";
  }
}
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(70px, 1fr)
  ); /* Adjust the minimum and maximum width as needed */
  gap: 0.5rem; /* Adjust the gap between images as needed */
}

.grid-item {
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
  aspect-ratio: 1/1; /* Maintain a 1:1 aspect ratio for each image */
}
</style>
