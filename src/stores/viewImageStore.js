import { defineStore } from "pinia";
import { ref } from "vue";

export const useViewImagesStore = defineStore("viewImages", {
  state: () => ({
    viewImages: ref(false),
    index: ref(0),
    images: ref([])
  })
});
