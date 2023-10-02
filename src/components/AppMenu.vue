<template>
  <div id="menu" class="w-3/4 bg-white p-5 rounded flex flex-col gap-4 md:w-96">
    <div
      id="menu-header"
      class="w-full p-2 rounded bg-white flex gap-4 items-center shadow-md shadow-blue-100 cursor-pointer hover:bg-gray-200"
      @click="$router.push('/profile')"
    >
      <div class="w-14 h-14">
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
      <div>
        <h4 class="text-2xl font-bold">{{ props.user.firstName }} {{ props.user.surname }}</h4>
      </div>
    </div>
    <div>
      <ul>
        <router-link to="/login">
          <li class="text-lg font-medium p-2 hover:bg-gray-200 rounded" @click="logoutUser">
            <span class="text-center p-2 bg-gray-100 rounded-full inline-block">
              <i class="fas fa-sign-out-alt"></i>
            </span>
            Logout
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const props = defineProps(['user']);

async function logoutUser() {
  userStore.logout();
}
</script>
