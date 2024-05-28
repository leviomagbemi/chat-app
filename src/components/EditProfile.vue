<template>
  <div
    class="mx-auto bg-white rounded shadow-md md:w-2/4 md:top-2/4 max-[600px]:w-full max-[600px]:top-2/4 py-5"
    v-if="props.editProfile"
  >
    <div class="text-center px-5 flex items-center">
      <h1 class="text-2xl font-bold flex-1">Edit Profile</h1>
      <button @click.prevent="closeEditModal"><i class="fas fa-times fa-lg"></i></button>
    </div>
    <hr class="my-5" />
    <div class="px-5">
      <!--Edit Name-->

      <div class="mb-5">
        <div class="flex justify-between mb-5">
          <h2 class="text-xl font-bold">Name</h2>
          <button @click.prevent="editName = true">
            <i class="fas fa-edit fa-lg text-blue-600"></i>
          </button>
        </div>
        <p class="text-center text-xl">
          {{ userStore.user.firstName }} {{ userStore.user.surname }}
        </p>
      </div>

      <div class="mb-5" v-if="editName">
        <input ref="firstName" id="first-name" placeholder="First Name" class="p-2 mb-3 w-full" />
        <input ref="surname" id="surname" placeholder="Surname" class="p-2 mb-3 w-full" />
        <button
          class="w-full bg-blue-600 py-3 text-white text-lg font-semibold rounded"
          @click="changeName"
        >
          Save
        </button>
      </div>

      <!--Edit Bio-->
      <div class="mb-5">
        <div class="flex justify-between">
          <h2 class="text-xl font-bold">Bio</h2>
          <button @click.prevent="editBio = true">
            <i class="fas fa-edit fa-lg text-blue-600"></i>
          </button>
        </div>
        <p class="text-center text-xl">Add A Bio</p>
      </div>

      <div class="mb-5" v-if="editBio">
        <textarea
          name="bio"
          ref="bio"
          id="bio"
          cols="4"
          rows="3"
          placeholder="Add Bio"
          class="p-2 w-full"
        ></textarea>
        <button
          class="w-full bg-blue-600 py-3 text-white text-lg font-semibold rounded"
          @click="changeBio"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const props = defineProps(["editProfile"]);
const emit = defineEmits(["closeEditModal"]);
const editName = ref(false);
const editBio = ref(false);
const firstName = ref(null);
const surname = ref(null);
const bio = ref(null);

async function changeName() {
  if (firstName.value.value && surname.value.value) {
    const db = getFirestore(firebase);

    const user = doc(db, "users", userStore.uid);

    await updateDoc(user, {
      firstName: firstName.value.value,
      surname: surname.value.value
    });

    editName.value = false;
  }
}

async function changeBio() {
  if (bio.value.value) {
    const db = getFirestore(firebase);

    const user = doc(db, "users", userStore.uid);

    await updateDoc(user, {
      bio: bio.value.value
    });

    editBio.value = false;
  }
}

function closeEditModal() {
  emit("closeEditModal");
  window.location.reload();
}
</script>
