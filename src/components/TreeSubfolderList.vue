<template>
  <ul ref="parentSubfolderList" class="vuefinder__tree">
    <li v-for="(item, index) in treeSubFolders"
        class="vuefinder__tree__item" :key="item.path">
      <div class="vuefinder__tree__item__header">
        <div class="vuefinder__tree__item__header__icon"  @click="showSubFolders[item.path] = !showSubFolders[item.path]">
          <FolderLoaderIndicator :adapter="adapter" :path="item.path" v-model="showSubFolders[item.path]" />
        </div>
        <div class="vuefinder__tree__item__header__title" :title="item.path"
            @click="app.emitter.emit('vf-fetch', {params:{q: 'index', adapter: props.adapter, path:item.path}})">
          <div class="vuefinder__tree__item__header__title__icon">
            <OpenFolderSVG v-if="app.fs.path === item.path"/>
            <FolderSVG v-else/>
          </div>
          <div class="vuefinder__tree__item__header__title__text" :class="{'vuefinder__tree__item__header__title__text--active' : app.fs.path === item.path}">{{ item.basename }}</div>
        </div>
      </div>
      <div class="vuefinder__tree__item__content">
        <TreeSubfolderList :adapter="props.adapter" :path="item.path" v-show="showSubFolders[item.path]" />
      </div>
    </li>
  </ul>
</template>

<style>
.vuefinder__tree {
  @apply block;
}

.vuefinder__tree__item {
  @apply flex flex-col space-x-0.5 py-0.5 text-sm;
}

.vuefinder__tree__item__header {
  @apply flex hover:text-sky-700 dark:hover:text-sky-200/50 rounded;
}

.vuefinder__tree__item__header__icon {
  @apply h-5 w-5 shrink-0;
}

.vuefinder__tree__item__header__title {
  @apply flex cursor-pointer;
}

.vuefinder__tree__item__header__title__icon {
  @apply h-5 w-5 shrink-0;
}

.vuefinder__tree__item__header__title__text {
  @apply text-nowrap pr-4;
}

.vuefinder__tree__item__header__title__text--active {
  @apply underline decoration-blue-300 dark:decoration-gray-400;
}

.vuefinder__tree__item__content {
  @apply pl-4;
}

</style>
<script setup>
import {computed, inject, onMounted, ref} from 'vue';

import FolderSVG from "./icons/folder.svg";
import OpenFolderSVG from "./icons/open_folder.svg";
import FolderLoaderIndicator from "./FolderLoaderIndicator.vue";
import {OverlayScrollbars} from "overlayscrollbars";

const app = inject('ServiceContainer');

const showSubFolders = ref([]);

const props = defineProps({
  adapter: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  }
});
const parentSubfolderList = ref(null)

onMounted(() => {
  // only initialize overlay scrollbars for the root folder
  if (props.path === props.adapter + '://') {
    OverlayScrollbars(parentSubfolderList.value, {
      scrollbars: {
        theme: 'vf-theme-dark dark:vf-theme-light',
      },
    });
  }
});
const treeSubFolders = computed(() => {
  return app.treeViewData.find(e => e.path === props.path)?.folders || [];
})
</script>
