<template>
  <div class="relative">
    <VeeField
      v-model="password"
      :type="type"
      name="password"
      class="w-full px-2 py-3 outline-none rounded border-2"
      placeholder="Password"
      :rules="{ regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/ }"
    />
    <i :class="`fas ${eyeIcon} fa-lg absolute right-5 top-6`" @click="togglePassWord"></i>
    <ErrorMessage name="password" class="text-red-500 font-semibold" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const type = ref('password');
const eyeIcon = ref('fa-eye-slash');
const password = ref('');

function togglePassWord() {
  if (password.value !== '' && type.value === 'password') {
    type.value = 'text';
    eyeIcon.value = 'fa-eye';
  } else {
    type.value = 'password';
    eyeIcon.value = 'fa-eye-slash';
  }
}
</script>
