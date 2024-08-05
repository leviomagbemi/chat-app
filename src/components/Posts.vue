<template>
  <!--Loading Content-->
  <article v-if="loading" class="w-full p-5 flex flex-col gap-4">
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
  <article v-else class="w-full p-5 flex flex-col gap-4 rounded bg-gray-50 fade mb-5">
    <div id="container" class="w-3/4 mx-auto max-[600px]:w-full">
      <!--post header-->
      <div id="header" class="flex gap-2 items-center mb-3">
        <div class="w-16 h-16">
          <img :src="profileDp" alt="" class="rounded-full" />
        </div>
        <div>
          <router-link
            :to="
              post.document.userID !== userStore.uid
                ? { name: 'discover-profile', params: { profile_id: profileID } }
                : { name: 'profile' }
            "
          >
            <h4 class="flex-1 font-semibold cursor-pointer hover:text-blue-600 text-md md:text-xl">
              {{ firstName }} {{ surname }}
            </h4>
          </router-link>
          <p class="text-xs md:text-sm font-semibold text-gray-400">
            {{ postTime }}
          </p>
        </div>
      </div>

      <!--post detail-->
      <div id="detail" class="mb-2">
        <p>{{ post.document.text }}</p>
      </div>

      <!--post iamge-->
      <div class="max-w-lg mb-3 mx-auto" v-if="post.images">
        <div v-if="post.images.length > 1" class="photo-grid">
          <div v-for="(image, index) in post.images" :key="index" class="grid-item">
            <img
              :src="image"
              alt=""
              @click.prevent="
                (viewImagesStore.index = index),
                  (viewImagesStore.images = post.images),
                  (viewImagesStore.viewImages = true)
              "
            />
          </div>
        </div>
        <div class="w-full">
          <button
            v-if="post.images.length > 4"
            class="bg-blue-600 text-white my-3 p-2 rounded col-span-2 w-full"
            @click.prevent="
              (viewImagesStore.images = post.images), (viewImagesStore.viewImages = true)
            "
          >
            View More
          </button>
        </div>
        <div v-if="post.images.length === 1">
          <div v-for="(image, index) in post.images" :key="index" class="single-picture">
            <img
              :src="image"
              alt=""
              class="single-picture"
              @click.prevent="
                (viewImagesStore.images = post.images), (viewImagesStore.viewImages = true)
              "
            />
          </div>
        </div>
      </div>

      <!--buttons-->
      <div class="flex gap-4">
        <button
          ref="updateLikeBtnClass"
          class="inline-block text-center rounded flex-1"
          :class="
            likeID
              ? 'bg-blue-500 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-black hover:bg-gray-400'
          "
          @click.prevent="likeID ? unlikePost : likePost"
        >
          {{ likes.length }} <i class="far fa-thumbs-up fa-lg"></i>
        </button>
        <button class="inline-block text-center bg-gray-200 hover:bg-gray-400 rounded flex-1">
          {{ comments.length }} <i class="fas fa-comments"></i>
        </button>
      </div>

      <!--comment-->
      <div>
        <CreatePostComment :post="post" @updateComment="(commentID) => updateComment(commentID)" />
      </div>

      <div v-if="comments.length > 0">
        <postComments v-for="comment in comments" :key="comment.commentID" :comment="comment" />
      </div>
    </div>
  </article>

  <div v-if="!loading && !post">No Posts</div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import CreatePostComment from "./CreatePostComment.vue";
import postComments from "./postComments.vue";
import { Timestamp } from "firebase/firestore";
import { useViewImagesStore } from "@/stores/viewImageStore";
import { useUserStore } from "@/stores/userStore";
import { useLikeCommentStore } from "@/stores/likeCommentStore";

//stores
const viewImagesStore = useViewImagesStore();
const userStore = useUserStore();
const likeCommentStore = useLikeCommentStore();

//data
const comments = ref([]);
const likes = ref([]);
const likeID = ref(null);
const updateLikeBtnClass = ref(null);

//firebase instance
const timeStamp = new Timestamp();

// props
const props = defineProps(["post", "loading", "dp", "firstName", "surname", "profileID", "gender"]);

onMounted(async () => {
  if (props.post) {
    await likeCommentStore.getComments(props.post.document.postID, comments.value);

    await likeCommentStore.getLikes(props.post.document.postID, likes.value);
  }
});

const postTime = computed(() => {
  timeStamp.seconds = props.post.document.date.seconds;
  timeStamp.nanoseconds = props.post.document.date.nanoseconds;
  const date = timeStamp.toDate().toDateString();

  const time = timeStamp.toDate().toLocaleTimeString();

  return `${date}, ${time}`;
});

const profileDp = computed(() => {
  if (!props.dp && props.gender == "female") {
    return userStore.female_dp;
  } else if (!props.dp && props.gender == "male") {
    return userStore.male_dp;
  } else {
    return props.dp;
  }
});

async function likePost() {
  likeID.value = await likeCommentStore.likePost(props.post.document.postID, userStore.user);

  await likeCommentStore.listenForLikes(props.post.document.postID, likeID.value, likes.value);

  updateLikeBtnClass.value.className =
    "inline-block text-center rounded flex-1 bg-blue-500 text-white hover:bg-blue-700";
}

async function unlikePost() {
  await likeCommentStore.unlikePost(props.post.document.postID, likeID.value);
}

async function updateComment(commentID) {
  await likeCommentStore.listenForComments(props.post.document.postID, commentID, comments.value);
}
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Adjust the minimum and maximum width as needed */
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

@media (max-width: 500px) {
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(120px, 1fr)
    ); /* Adjust the minimum and maximum width as needed */
    gap: 0.5rem; /* Adjust the gap between images as needed */
  }
}
</style>
