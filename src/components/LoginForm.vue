<template>
  <div class="w-full h-auto bg-white rounded-md shadow-md p-5 md:w-1/2">
    <div v-if="formAlertMessage !== ''" class="text-center py-3 rounded" :class="formAlertClass">
      {{ formAlertMessage }}
    </div>
    <h1 class="text-4xl font-bold mb-5 rounded text-blue-600">Login</h1>
    <VeeForm @submit="logUser" :validation-schema="schema" id="loginForm">
      <EmailInput />
      <PasswordInput />
      <div>
        <button
          class="w-full py-3 bg-blue-600 my-3 rounded-md font-bold text-white text-xl hover:bg-blue-800 flex justify-center"
        >
          <span>Log In</span>
          <i v-show="processingLogin" class="w-8 inline-block"
            ><img v-if="!isLogin" src="@/assets/loading.gif" class="w-full" />
            <img v-else src="@/assets/checkmark.png" class="w-full" />
          </i>
        </button>
        <div class="text-center">
          <a class="text-blue-600 hover:text-blue-400 cursor-pointer"> Reset password </a>
        </div>
        <hr class="my-3" />
      </div>
    </VeeForm>
   <router-link :to="{ name: 'signup' }">
    <button
      type="button"
      class="w-full py-3 bg-cyan-600 rounded-md font-bold text-white text-xl hover:bg-cyan-800"
    >
      Sign Up
    </button>
  </router-link>
  </div>
</template>

<script setup>
import EmailInput from "./EmailInput.vue";
import PasswordInput from "./PasswordInput.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
const processingLogin = ref(false);
const isLogin = ref(null);
const user = useUserStore();
const router = useRouter();
const formAlertMessage = ref("");
const formAlertClass = ref("bg-green-300 text-white");

const schema = {
  email: "required|email",
  password: "required"
};

async function logUser(values) {
  processingLogin.value = true;
  isLogin.value = false;
  try {
    await user.authenticate(values);
    isLogin.value = true;
    formAlertClass.value = "bg-green-500 text-white";
    formAlertMessage.value = "Login Successful";
    setTimeout(() => router.push("/"), 1000);
  } catch (err) {
    formAlertClass.value = "bg-red-200 text-red-800";

    switch (err.toString()) {
      case "FirebaseError: Firebase: Error (auth/user-not-found).":
        formAlertMessage.value = "Email doesn't exist. Please check email or signup";
        break;
      case "FirebaseError: Firebase: Error (auth/wrong-password).":
        formAlertMessage.value = "Incorrect password. Please check your password and try again.";
        break;
      default:
        formAlertMessage.value = err;
    }
    console.log(err);
    processingLogin.value = false;
    isLogin.value = null;
    // document.querySelector('#loginForm').reset();
  }
}
</script>
