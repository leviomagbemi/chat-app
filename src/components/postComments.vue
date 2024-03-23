<template>
  <div v-if="comment" class="flex gap-3 mb-2">
    <div class="w-10 h-10">
      <img class="w-full rounded-full" :src="dp" alt="" />
    </div>

    <div class="grow bg-gray-200 p-2 rounded">
      <h3 class="text-lg font-semibold">{{ comment.user.firstName }} {{ comment.user.surname }}</h3>
      <p>{{ comment.comment }}</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user.js";
import { computed } from "vue";

const userStore = useUserStore();

const props = defineProps(["comment"]);

const dp = computed(() => {
  if (props.comment) {
    if (!props.comment.user.dp && props.comment.user.gender == "female") {
      return userStore.female_dp;
    } else if (!props.comment.user.dp && props.comment.user.gender == "male") {
      return userStore.male_dp;
    } else {
      return props.comment.user.dp;
    }
  }
});
</script>

<style scoped></style>
