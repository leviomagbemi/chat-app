<template>
  <div v-if="isLogin" class="flex justify-center items-center h-screen">
    <LoginForm @signUpModal="isLogin = false" />
  </div>

  <div
    v-if="!isLogin"
    class="flex justify-center items-center h-full w-full fixed bg-gray-700 overflow-y-scroll py-5"
  >
    <SignupForm @loginModal="isLogin = true" class="z-10 mt-20" />
  </div>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue';
import SignupForm from '@/components/SignupForm.vue';
import { ref } from 'vue';

const isLogin = ref(true);
</script>
