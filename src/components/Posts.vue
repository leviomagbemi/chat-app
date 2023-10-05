<template>
  <!--Loading Content-->
  <article v-if="props.loading" class="w-full p-5 flex flex-col gap-4">
    <!-- Loading content for individual post -->
    <div id="container">
      <div id="header" class="flex gap-2 items-center mb-3">
        <div class="w-16 h-16 rounded-full bg-gray-100">
          <!-- Loading profile picture -->
        </div>
        <div class="flex-1 h-5 bg-gray-100 rounded loading-left">
          <!-- Loading user name -->
        </div>
      </div>

      <div id="detail" class="h-16 bg-gray-100 mb-3 rounded loading-left">
        <!-- Loading post text -->
      </div>

      <div class="h-32 bg-gray-100 mb-3 rounded loading-right">
        <!-- Loading images -->
      </div>

      <div class="h-5 bg-gray-100 mb-3 rounded loading-left">
        <!-- Loading buttons -->
      </div>
    </div>
  </article>

  <!--Main Post Content-->
  <article
    v-else
    v-for="post in props.posts"
    :key="post.document.postID"
    class="w-full p-5 flex flex-col gap-4 rounded bg-gray-50 fade"
  >
    <div id="container" class="w-3/4 mx-auto">
      <!--post header-->
      <div id="header" class="flex gap-2 items-center mb-3">
        <div class="w-16 h-16">
          <img :src="props.profilePicture" alt="" class="rounded-full" />
        </div>
        <h4 class="flex-1 font-semibold">{{ post.document.userName }}</h4>
      </div>

      <!--post detail-->
      <div id="detail" class="mb-2">
        <p>{{ post.document.text }}</p>
      </div>

      <!--post iamge-->
      <div class="max-w-lg mb-3 mx-auto" v-if="post.images">
        <div v-if="post.images.length > 1" class="photo-grid">
          <div v-for="(image, index) in post.images" :key="index" class="grid-item">
            <img :src="image" alt="" />
          </div>
          <button
            v-if="post.images.length > 4"
            class="bg-blue-600 text-white my-3 p-2 rounded col-span-2"
          >
            View More
          </button>
        </div>

        <div v-else>
          <div v-for="(image, index) in post.images" :key="index" class="single-picture">
            <img :src="image" alt="" />
          </div>
        </div>
      </div>

      <!--buttons-->
      <div class="flex gap-4">
        <button
          class="inline-block text-center rounded flex-1 bg-gray-200 hover:bg-gray-200"
          :class="'text-black'"
        >
          {{ post.document.likes.length }} <i class="far fa-thumbs-up fa-lg"></i>
        </button>
        <button class="inline-block text-center bg-gray-200 hover:bg-gray-200 rounded flex-1">
          {{ post.document.comments.length }} <i class="fas fa-comments"></i>
        </button>
      </div>
    </div>
  </article>

  <div v-if="!props.loading && props.posts.length === 0">No Posts</div>
</template>

<script setup>
const props = defineProps(["posts", "loading", "profilePicture"]);
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(200px, 1fr)
  ); /* Adjust the minimum and maximum width as needed */
  gap: 0.5rem; /* Adjust the gap between images as needed */
}

.grid-item {
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
  aspect-ratio: 1/1; /* Maintain a 1:1 aspect ratio for each image */
}

.photo-grid .grid-item:nth-child(n + 5) {
  background-color: red;
  display: none;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Crop and scale images to fit the grid item */
}

.single-picture {
  max-width: 400px;
  margin: auto;
}

.single-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Crop and scale images to fit the grid item */
}
</style>