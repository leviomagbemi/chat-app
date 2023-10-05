<template>
  <section class="pt-5 px-5" id="main-sec">
    <CreatePost />
    <main class="flex flex-col gap-10 bg-white rounded p-5" id="main-content">
      <Posts :posts="posts" :loading="loading" :profilePicture="userStore.profilePicture" />
    </main>
  </section>
</template>

<script setup>
import Posts from "@/components/Posts.vue";
import CreatePost from "@/components/CreatePost.vue";
import { ref, onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user.js";
import { usePostStore } from "@/stores/post.js";

const userStore = useUserStore();
const postStore = usePostStore();
const posts = ref([]);
const loading = ref(false);

onBeforeMount(async () => {
  await postStore.getPosts(posts, loading);
});
</script>
