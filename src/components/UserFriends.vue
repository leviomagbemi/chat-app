<template>
  <article class="shadow-md p-5">
    <figure class="flex items-center gap-5">
      <div class="md:w-32 md:h-32 w-20 h-20">
        <img class="rounded-full" :src="dp" />
      </div>
      <div>
        <figcaption>
          <router-link
            :to="{ name: 'discover-profile', params: { profile_id: friend.profile_id } }"
          >
            <p class="text-xl font-semibold cursor-pointer hover:text-blue-600">
              {{ friend.firstName }} {{ friend.surname }}
            </p>
          </router-link>
        </figcaption>
      </div>
    </figure>
  </article>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

const props = defineProps(["friend"]);

const dp = computed(() => {
  if (!props.friend.dp && props.friend.gender == "female") {
    return userStore.female_dp;
  } else if (!props.friend.dp && props.friend.gender == "male") {
    return userStore.male_dp;
  } else {
    return props.friend.dp;
  }
});
</script>

<style lang="scss" scoped></style>
