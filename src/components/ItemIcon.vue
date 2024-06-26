<template>
  <span>
    <FolderSVG v-if="type === 'dir'" :class="{'vuefinder__item-icon--small': small, 'vuefinder__item-icon': !small}" />
    <FileSVG v-else :class="{'vuefinder__item-icon--small': small, 'vuefinder__item-icon': !small}" />
  </span>
</template>

<style>
.vuefinder__item-icon--small {
  @apply h-5 w-5;
}

.vuefinder__item-icon {
  @apply h-10 w-10 md:h-12 md:w-12 m-auto;
}
</style>

<script setup>
import {defineProps} from "vue";
import FileSVG from './icons/file.svg';
importFolderSVG from './icons/folder.svg';

defineProps({
  type: {
    type: String,
    required: true
  },

  small: {
    type: Boolean,
    default: false
  }
})

</script>
