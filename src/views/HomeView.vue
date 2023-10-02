<template>
  <section class="pt-5 px-5" id="main-sec">
    <CreatePost />
    <main class="flex flex-col gap-10 bg-white rounded p-5" id="main-content">
      <Posts />
    </main>
  </section>
</template>

<script setup>
import Posts from '@/components/Posts.vue';
import CreatePost from '@/components/CreatePost.vue';
</script>
