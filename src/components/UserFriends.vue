<template>
  <article class="shadow-md p-5">
    <figure class="flex items-center gap-5">
      <div class="w-32 h-32">
        <img class="rounded-full" :src="friend.friend.dp" />
      </div>
      <div>
        <figcaption>
          <router-link
            :to="{ name: 'discover-profile', params: { profile_id: friend.friend.profile_id } }"
          >
            <p class="text-xl font-semibold cursor-pointer hover:text-blue-600">
              {{ friend.friend.firstName }} {{ friend.friend.surname }}
            </p>
          </router-link>
        </figcaption>
      </div>
    </figure>
  </article>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps(["friend"]);

onMounted(() => {
  console.log(props.friend);
});
</script>

<style lang="scss" scoped></style>
