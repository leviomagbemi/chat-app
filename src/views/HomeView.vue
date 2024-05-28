<template>
  <section class="pt-5 px-5 max-[600px]:px-3" id="main-sec">
    <CreatePost />
    <main class="bg-white rounded" id="main-content">
      <div v-if="feedPostStore.feedPosts.length == 0 && !feedPostStore.loading">
        <h1 class="text-2xl font-bold text-center">
          No Posts. Make a post or add friends to see their posts
        </h1>
      </div>
      <FeedPosts
        v-for="post in feedPostStore.feedPosts"
        :key="post.postID"
        :post="post"
        :loading="feedPostStore.loading"
        :dp="post.user.dp"
        :firstName="post.user.firstName"
        :surname="post.user.surname"
        :profile_id="post.user['profile_id']"
        :gender="post.user.gender"
      />
    </main>
  </section>
  <viewImages v-show="viewImagesStore.viewImages" />
</template>

<script setup>
import FeedPosts from "@/components/FeedPosts.vue";
import CreatePost from "@/components/CreatePost.vue";
import viewImages from "@/components/viewImages.vue";

import { useViewImagesStore } from "@/stores/viewImageStore";
import { useFeedPostStore } from "@/stores/feedPostStore";

const feedPostStore = useFeedPostStore();
const viewImagesStore = useViewImagesStore();
</script>
