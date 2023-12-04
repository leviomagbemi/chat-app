<template>
  <section class="pt-5 px-5 max-[600px]:px-3" id="main-sec">
    <CreatePost />
    <main class="bg-white rounded" id="main-content">
      <FeedPosts
        v-for="post in feedPostStore.feedPosts"
        :key="post.postID"
        :post="post"
        :loading="feedPostStore.loading"
        :profilePicture="post.user.dp"
        :firstName="post.user.firstName"
        :surname="post.user.surname"
        :profileID="post.user['profile_id']"
      />
    </main>
  </section>
  <viewImages v-show="viewImagesStore.viewImages" />
</template>

<script setup>
import FeedPosts from "@/components/FeedPosts.vue";
import CreatePost from "@/components/CreatePost.vue";
import viewImages from "@/components/viewImages.vue";

import { useViewImagesStore } from "@/stores/viewImages";
import { useFeedPostStore } from "@/stores/feedPost";

const feedPostStore = useFeedPostStore();
const viewImagesStore = useViewImagesStore();
</script>
