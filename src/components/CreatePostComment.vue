<template>
  <div class="my-5 flex gap-3">
    <div class="flex-none w-10 h-10">
      <img class="w-100 rounded-full" :src="dp" alt="" />
    </div>

    <div class="grow bg-gray-50 flex">
      <input
        v-model="commentInput"
        class="p-2 bg-gray-50 w-full rounded-full border-none outline-none"
        type="text"
        placeholder="Write a comment"
      />

      <button @click.prevent="submitComment">
        <i
          class="fas fa-paper-plane fa-lg"
          :class="
            commentInput ? 'text-blue-600 hover:text-blue-700' : 'text-gray-500 hover:text-gray-600'
          "
        ></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useLikeCommentStore } from "@/stores/likeCommentStore";

const props = defineProps(["post"]);
const emit = defineEmits(["updateComment"]);
const userStore = useUserStore();
const likeCommentStore = useLikeCommentStore();
const commentInput = ref("");

const dp = computed(() => {
  if (!userStore.user.dp && userStore.user.gender == "female") {
    return userStore.female_dp;
  } else if (!userStore.user.dp && userStore.user.gender == "male") {
    return userStore.male_dp;
  } else {
    return userStore.user.dp;
  }
});

async function submitComment() {
  if (commentInput.value)
    await likeCommentStore.postComment(
      commentInput.value,
      props.post.document.postID,
      props.post.user
    );

  commentInput.value = "";
}
</script>

<style scoped></style>
