<template>
  <div class="w-screen h-screen bg-gray-900 opacity-30 fixed top-0"></div>
  <div
    class="bg-white md:w-2/5 w-3/4 py-5 rounded mx-auto drop-shadow-md fixed z-10 top-1/2 left-1/2"
    style="transform: translate(-50%, -50%)"
  >
    <div class="flex px-5">
      <h2 class="text-xl font-bold flex-1 text-center">Update Profile Picture</h2>
      <button
        class="py-3 px-4 bg-gray-200 rounded-full text-center hover:bg-gray-300"
        @click="closeUploadModal"
      >
        <i class="fas fa-times fa-lg"></i>
      </button>
    </div>
    <hr class="my-5" />
    <div class="text-center px-5">
      <label
        for="dp"
        class="bg-blue-200 w-full block py-2 rounded text-blue-600 font-semibold hover:bg-blue-300"
        ><i class="fas fa-plus"></i> Upload Photo</label
      >
      <input
        type="file"
        id="dp"
        multiple
        accept=".jpg, .jpeg, .png"
        class="visually-hidden"
        name="images"
        @change="loadFile"
      />
    </div>
    <div class="text-center px-5">
      <!--Photo Preview-->
      <div class="my-3">
        <div class="w-20 h-20 mx-auto my-3" v-for="(image, index) in thumbnail" :key="index">
          <img :src="image" alt="" class="w-full grid-item" />
        </div>
      </div>
      <!--Progress bar-->
      <div class="w-full h-5 bg-gray-200 rounded-xl mb-3">
        <div class="bg-blue-400 h-5 rounded-xl" :style="{ width: progress + '%' }"></div>
      </div>

      <!--Upload button-->
      <button
        class="bg-blue-600 px-5 py-3 text-white rounded font-semibold hover:bg-blue-800"
        @click.prevent="upload"
      >
        Upload Profile Picture
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import {
  getStorage,
  ref as firebaseRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { setDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";
import { useUserStore } from "@/stores/userStore";

const file = ref({});
const fileRef = ref(null);
const images = ref([]);
const thumbnail = ref([]);
const progress = ref(0);
const userStore = useUserStore();

const emit = defineEmits(["closeUploadModa"]);

onBeforeMount(async () => {
  await userStore.checkUser();
});

function loadFile(e) {
  try {
    file.value = e.target.files[0];

    //image preview
    images.value = e.target.files;
    const thumbnailImages = Array.from(images.value);

    for (let image of thumbnailImages) {
      const objectUrl = URL.createObjectURL(image);
      thumbnail.value.push(objectUrl);
    }

    const storage = getStorage();

    fileRef.value = firebaseRef(storage, `${userStore.uid}/profile-pictures/${file.value.name}`);

    console.log(fileRef.value._location.path_);
  } catch (error) {
    console.log(error);
  }
}

async function upload() {
  try {
    const upload = uploadBytesResumable(fileRef.value, file.value);

    upload.on(
      "state_changed",
      async (snapshot) => {
        progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const dp = await getDownloadURL(upload.snapshot.ref);
        emit("closeUploadModal");
        const db = getFirestore(firebase);

        const user = doc(db, "users", userStore.uid);

        await updateDoc(user, {
          dp
        });
        userStore.user.dp = dp;
      }
    );

    const db = getFirestore(firebase);

    await setDoc(doc(db, "profile_pictures", userStore.uid), {
      name: fileRef.value._location.path_
    });
    console.log(fileRef.value._location.path_);
  } catch (error) {
    console.log(error);
  }
}

function closeUploadModal() {
  emit("closeUploadModal");
}
</script>
