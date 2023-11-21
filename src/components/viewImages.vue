<template>
  <div class="fixed w-full h-full top-0 bg-black" style="z-index: 1500">
    <!--close icon-->
    <div class="p-5 w-20 h-20">
      <i
        class="fas fa-times fa-lg text-4xl text-white"
        @click.prevent="viewImagesStore.viewImages = false"
      ></i>
    </div>

    <!--image area-->
    <div class="h-full max-[600px]:relative max-[600px]:top-16">
      <i
        class="fas fa-chevron-left fa-lg text-4xl text-white absolute min-[768px]:top-2/4 min-[768px]:left-1/4 max-[600px]:top-1/4"
        @click.prevent="prevImage"
        v-if="viewImagesStore.images.length > 1"
      ></i>
      <div
        class="w-3/12 max-[600px]:w-full min-[768px]:w-1/4 min-[768px]:absolute min-[768px]:top-2/4 min-[768px]:left-2/4 min-[768px]:-translate-y-2/4 min-[768px]:-translate-x-2/4 mx-auto"
      >
        <img class="view w-full" :src="viewImagesStore.images[index]" />
      </div>
      <i
        class="fas fa-chevron-right fa-lg text-4xl text-white absolute min-[768px]:top-2/4 min-[768px]:right-1/4 max-[600px]:top-1/4 max-[600px]:right-0"
        @click="nextImage"
        v-if="viewImagesStore.images.length > 1"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useViewImagesStore } from "@/stores/viewImages";

const viewImagesStore = useViewImagesStore();
const index = ref(0);

function nextImage() {
  if (index.value >= viewImagesStore.images.length - 1) {
    index.value = 0;
    return;
  }
  index.value++;
}

function prevImage() {
  if (index.value === 0) {
    index.value = viewImagesStore.images.length - 1;
    return;
  }

  index.value--;
}
</script>

<style lang="scss" scoped></style>
