<template>
  <div
      @click="showSubFolders = !showSubFolders"
      class="vuefinder__tree_storage">
    <div
        class="vuefinder__tree_storage__title"
        :class="storage === app.fs.adapter ? 'vuefinder__tree_storage__title--active' : ''">
      <div class="vuefinder__tree_storage__icon" :class="storage === app.fs.adapter ? 'vuefinder__tree_storage__icon--active' : ''">
        <StorageSVG />
      </div>
      <div>{{ storage }}</div>
    </div>

    <div class="vuefinder__tree_storage__folder__loader__indicator">
      <FolderLoaderIndicator :adapter="storage" :path="storage + '://'" v-model="showSubFolders" />
    </div>
  </div>
  <TreeSubfolderList :adapter="storage" :path="storage + '://'" v-show="showSubFolders" class="vuefinder__tree_storage__tree_subfolder_list"/>
</template>

<style>
.vuefinder__tree_storage {
  @apply p-1 py-1.5 uppercase font-bold text-gray-400 dark:text-gray-500 text-xs flex justify-between bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 cursor-pointer;
}

.vuefinder__tree_storage__title {
  @apply flex flex-1 space-x-1 items-center ;
}

.vuefinder__tree_storage__title--active {
  @apply text-gray-700/80 dark:text-gray-300/80 font-bold;
}

.vuefinder_tree__storage__icon {
  @apply h-5 w-5 shrink-0 ;
}

.vuefinder_tree__storage__icon--active {
  @apply text-sky-500 dark:text-slate-300;
}

.vuefinder_tree__storage__folder__loader__indicator {
  @apply pointer-events-none pr-1;
}

.vuefinder__tree_storage__tree_subfolder_list {
  @apply overflow-x-auto my-1;
}
</style>

<script setup>
import {inject, ref} from 'vue';

import StorageSVG from "./icons/storage.svg";
import FolderLoaderIndicator from "./FolderLoaderIndicator.vue";
import TreeSubfolderList from "./TreeSubfolderList.vue";

const app = inject('ServiceContainer');
const showSubFolders = ref(false);
const props = defineProps({
  storage: {
    type: String,
    required: true,
  },
});
</script>
