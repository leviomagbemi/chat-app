<template>
  <header class="bg-blue-600 text-white" v-cloak>
    <div
      class="grid grid-cols-3 gap-3 items-center p-5 h-auto w-full mx-auto md:p-0 md:max-w-screen-lg md:h-28 min-[768px]:px-3"
    >
      <div id="logo" class="text-4xl font-bold order-first col-span-2 md:col-span-1">ChatAPP.</div>
      <AppNav :friends="friends" :notifications="notifications" />

      <!--avatar-->
      <div id="avatar" class="justify-self-end" @click="$emit('toggleMenu')">
        <div
          class="md:col-span-1 bg-white w-14 h-14 rounded-full border-4 border-cyan-200 hover:opacity-50"
        >
          <div class="bg-white" v-if="!props.user">
            <!--loading avatar-->
          </div>

          <div v-else>
            <img class="rounded-full" :src="dp" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import AppNav from "./AppNav.vue";

const userStore = useUserStore();

const props = defineProps(["user", "friends", "notifications"]);

const dp = computed(() => {
  if (!userStore.user.dp && userStore.user.gender == "female") {
    return userStore.female_dp;
  } else if (!userStore.user.dp && userStore.user.gender == "male") {
    return userStore.male_dp;
  } else {
    return userStore.user.dp;
  }
});
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
