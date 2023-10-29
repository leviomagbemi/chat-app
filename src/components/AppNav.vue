<template>
  <nav class="order-last justify-self-center md:-order-2 col-span-3 md:col-auto">
    <ul class="flex gap-1 justify-center md:gap-6">
      <router-link :to="{ name: 'friends' }">
        <li class="flex flex-col items-center hover:bg-blue-400 px-3 py-5 rounded-md">
          <i class="fas fa-users text-2xl relative"
            ><span
              class="absolute inline-block w-5 h-5 text-sm rounded-full bg-red-500 text-center align-center bottom-6 right-px"
              >{{ friends }}</span
            ></i
          >Friends
        </li>
      </router-link>
      <router-link :to="{ name: 'home' }">
        <li class="flex flex-col items-center hover:bg-blue-400 px-3 py-5 rounded-md">
          <i class="fas fa-home text-2xl"> </i>Home
        </li>
      </router-link>
      <li class="flex flex-col items-center hover:bg-blue-400 px-3 py-5 rounded-md">
        <i class="fas fa-inbox text-2xl relative">
          <span
            class="absolute inline-block w-5 h-5 text-sm rounded-full bg-red-500 text-center align-center bottom-6 right-px"
            >0</span
          > </i
        >Chats
      </li>
      <router-link :to="{ name: 'notifications' }">
        <li class="flex flex-col items-center hover:bg-blue-400 px-3 py-5 rounded-md">
          <i class="fas fa-bell text-2xl relative">
            <span
              class="absolute inline-block w-5 h-5 text-sm rounded-full bg-red-500 text-center align-center bottom-6 right-px"
              >{{ notifications }}</span
            > </i
          >Notification
        </li>
      </router-link>
    </ul>
  </nav>
</template>

<script setup>
defineProps(["friends", "notifications"]);
</script>
