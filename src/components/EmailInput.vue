<template>
  <div class="mb-3">
    <VeeField
      type="email"
      name="email"
      id="email"
      class="w-full px-2 py-3 outline-none rounded border-2"
      placeholder="Email"
    />
    <ErrorMessage name="email" class="text-red-500 font-semibold" />
  </div>
</template>

<script setup></script>
