<template>
  <div class="w-full h-auto m-auto bg-white rounded-md shadow-md p-5 md:w-1/2">
    <div
      v-if="formAlertMessage !== ''"
      class="text-center py-3 rounded mb-3"
      :class="formAlertClass"
    >
      {{ formAlertMessage }}
    </div>
    <div>
      <h1 class="text-4xl font-bold mb-5 rounded text-blue-600">Sign Up</h1>
    </div>
    <hr class="my-3" />
    <VeeForm @submit="register" :validation-schema="schema" id="form">
      <div class="flex gap-2 mb-3">
        <div class="flex-1">
          <VeeField
            type="text"
            placeholder="First Name"
            class="w-full p-2 outline-none rounded border-2"
            id="first-name"
            name="First Name"
          />
          <ErrorMessage name="First Name" class="text-red-500 font-semibold" />
        </div>

        <div class="flex-1">
          <VeeField
            type="text"
            placeholder="Surname"
            class="w-full p-2 outline-none rounded border-2"
            id="surname"
            name="surname"
          />
          <ErrorMessage name="surname" class="text-red-500 font-semibold" />
        </div>
      </div>
      <div>
        <EmailInput />
        <PasswordInput />
      </div>
      <div class="my-3">
        <label for="date" class="block text-start block text-start mb-2 font-semibold"
          >Date of birth</label
        >
        <VeeField
          type="date"
          id="date"
          class="w-full p-2 outline-none rounded border-2"
          name="dob"
        />
        <ErrorMessage name="dob" class="text-red-500 font-semibold" />
      </div>
      <div class="my-3">
        <div class="block text-start block text-start mb-2 font-semibold">Gender</div>
        <div class="flex gap-2">
          <span class="flex gap-2 p-2 border-2 rounded flex-1">
            <label for="female" class="text-lg">Female</label>
            <VeeField
              type="radio"
              name="gender"
              id="female"
              class="outline-none rounded border-2 align-items mt-1"
              value="female"
            />
          </span>
          <span class="flex gap-2 p-2 border-2 rounded flex-1">
            <label for="male" class="text-lg">Male</label>
            <VeeField
              type="radio"
              name="gender"
              id="male"
              class="outline-none rounded border-2 align-items mt-1"
              value="male"
            />
          </span>
        </div>
        <ErrorMessage name="gender" class="text-red-500 font-semibold" />
      </div>
      <button
        class="w-full py-3 bg-blue-600 text-xl text-white font-bold rounded-md hover:bg-blue-800 flex justify-center"
      >
        <span>Sign Up</span>
        <i v-show="processingSignUp" class="w-8 inline-block"
          ><img v-if="!registered" src="@/assets/loading.gif" class="w-full" />
          <img v-else src="@/assets/checkmark.png" class="w-full" />
        </i>
      </button>
    </VeeForm>
  
</div>
</template>

<script setup>
import EmailInput from "./EmailInput.vue";
import PasswordInput from "./PasswordInput.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore.js";

const processingSignUp = ref(false);
const registered = ref(null);
const formAlertMessage = ref("");
const formAlertClass = ref("bg-green-300 text-white");
const userStore = useUserStore();


const schema = {
  email: "required|email",
  "First Name": "min:2|max:20|required",
  surname: "min:2|max:20|required",
  password: "|required|min:8|max:16|",
  dob: "required",
  gender: "required"
};

async function register(values) {
  processingSignUp.value = true;
  registered.value = false;
  try {
    await userStore.createUser(values);
    registered.value = true;
    formAlertClass.value = "bg-green-500 text-white";
    formAlertMessage.value = "Successfully Registered";
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    formAlertClass.value = "bg-red-200 text-red-800";
    switch (err.toString()) {
      case "FirebaseError: Firebase: Error (auth/email-already-in-use).":
        formAlertMessage.value = "Email already exit. Please signin";
        break;
      default:
        formAlertMessage.value = err;
        console.log(err);
    }
    processingSignUp.value = false;
    registered.value = null;
  }
}
</script>
