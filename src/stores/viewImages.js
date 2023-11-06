import { defineStore } from "pinia";
import { ref } from "vue";

export const useViewImagesStore = defineStore("viewImages", {
  state: () => ({
    viewImages: ref(false),
    images: ref([])
  })
});
