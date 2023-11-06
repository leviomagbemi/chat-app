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
            <img
              v-if="props.user.gender === 'male' && userStore.profilePicture === ''"
              class="rounded-full"
              src="@/assets/avatar-male.jpg"
              i
              alt=""
            />
            <img
              v-else-if="props.user.gender === 'female' && userStore.profilePicture === ''"
              class="rounded-full"
              src="@/assets/avatar-male.jpg"
              i
              alt=""
            />
            <img v-else class="rounded-full" :src="userStore.profilePicture" i alt="" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import AppNav from "./AppNav.vue";
import { useUserStore } from "@/stores/user";

const props = defineProps(["user", "friends", "notifications"]);
const userStore = useUserStore();
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
