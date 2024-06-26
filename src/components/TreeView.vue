<template>
  <div @click="app.showTreeView = ! app.showTreeView" class="w-full h-full bg-gray-300/10 dark:bg-gray-700/10 z-[1]" :class="app.showTreeView ? 'backdrop-blur-sm absolute md:hidden' : 'hidden'"></div>
  <div :style="app.showTreeView ? 'min-width:100px;max-width:75%; width: '+ treeViewWidth + 'px' : 'width: 0'"
       class="vuefinder__treeview">
    <div ref="treeViewScrollElement" class="vuefinder__treeview__wrapper" >
      <div class="vuefinder__treeview__header">
        <div @click="pinnedFoldersOpened = !pinnedFoldersOpened"
            class="vuefinder__treeview__header__pinned">
          <div class="vuefinder__treeview__header__pinned__title"><PinSVG class="vuefinder__treeview__header__pinned__icon" /><div class="vuefinder__treeview__header__pinned__text">{{ t('Pinned Folders') }}</div></div>
          <FolderIndicator v-model="pinnedFoldersOpened" />
        </div>
        <ul class="vuefinder__treeview__header__list" v-if="pinnedFoldersOpened">
          <li v-for="favorite in app.pinnedFolders" class="vuefinder__treeview__header__list__item">
              <div class="vuefinder__treeview__header__list__item__title"
                    @click="app.emitter.emit('vf-fetch', {params:{q: 'index', adapter: favorite.storage, path:favorite.path}})"   >
                  <FolderSVG class="vuefinder__treeview__header__list__item__icon--closed" v-if="app.fs.path !== favorite.path"/>
                  <OpenFolderSVG class="vuefinder__treeview__header__list__item__icon--open" v-if="app.fs.path === favorite.path"/>
                  <div :title="favorite.path" class="vuefinder__treeview__header__list__item__text" :class="{'vuefinder__treeview__header__list__item__text--active' : app.fs.path === favorite.path}">{{ favorite.basename }} </div>
              </div>
              <div class="vuefinder__treeview__header__list__item__remove" @click="removeFavorite(favorite)" >
                  <XBoxSVG class="vuefinder__treeview__header__list__item__remove__icon" />
              </div>
          </li>
          <li v-if="!app.pinnedFolders.length">
             <div class="vuefinder__treeview__header__list__item__text--empty">{{ t('No folders pinned') }}</div>
          </li>
        </ul>
      </div>

      <div class="vuefinder__treeview__storage" v-for="storage in app.fs.data.storages">
        <TreeStorageItem :storage="storage"/>
      </div>
    </div>
    <div
        @mousedown="handleMouseDown"
        :class="app.showTreeView ? '' : ''"
        class="vuefinder__treeview__scrollbar">
    </div>
  </div>
</template>

<style>
.vuefinder__treeview {
 @apply absolute h-full md:h-auto md:relative shadow-lg shrink-0 transition-[width] ease-in-out duration-200 z-[1] bg-gray-50 dark:bg-[#242f41];
}

.vuefinder_treeview__wrapper {
  @apply h-full border-r dark:border-gray-600/50 pb-4;
}

.vuefinder__treeview__header {
  @apply sticky left-0 dark:border-gray-600;
}

.vuefinder__treeview__header__pinned {
  @apply pr-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border-b p-1 py-1.5 uppercase font-bold text-gray-400 dark:text-gray-400 text-xs flex items-center justify-between cursor-pointer;
}

.vuefinder__treeview__header__pinned__title {
  @apply flex items-center space-x-1;
}

.vuefinder__treeview__header__pinned__icon {
  @apply text-red-600;
}

.vuefinder__treeview_header_pinned_text {
  @apply text-nowrap;
}

.vuefinder_treeview_header_list {
  @apply block my-1;
}

.vuefinder_treeview_header_list__item {
  @apply flex pl-2 py-0.5 text-sm justify-between pr-2;
}

.vuefinder_treeview_header_list__item__title {
  @apply flex hover:text-sky-500 dark:hover:text-sky-200/50 rounded cursor-pointer;
}

.vuefinder_treeview_header_list__item__icon--close {
  @apply h-5 w-5;
}

.vuefinder_treeview_header_list__item__icon--open {
  @apply h-5 w-5;
}

.vuefinder__treeview_header_list__item__text {
  @apply text-nowrap;
}

.vuefinder__treeview_header_list__item__text--active {
  @apply underline decoration-blue-300 dark:decoration-gray-400;
}

.vuefinder__treeview_header_list__item__remove {
  @apply cursor-pointer;
}

.vuefinder__treeview_header_list__item__remove__icon {
  @apply p-0.5 text-gray-300 hover:text-gray-400 dark:text-gray-600 hover:dark:text-gray-400;
}

.vuefinder__treeview__header__list__item__text--empty {
  @apply p-1 text-xs text-center;
}

.vuefinder__treeview_storage {
  @apply sticky left-0;
}

.vuefinder__treeview_scrollbar {
  @apply transition-colors ease-in-out duration-200  top-0 hover:bg-slate-600/10 dark:hover:bg-slate-300/10 w-1 h-full absolute -right-0.5 cursor-ew-resize;
}
</style>

<script setup>
import {inject, onMounted, ref, watch} from 'vue';
import FolderSVG from './icons/folder.svg';
import OpenFolderSVG from './icons/open_folder.svg';
import PinSVG from "./icons/pin.svg";
import XBoxSVG from "./icons/x_box.svg";

import {OverlayScrollbars} from 'overlayscrollbars';
import TreeStorageItem from "./TreeStorageItem.vue";
import upsert from "../utils/upsert";
import FolderIndicator from "./FolderIndicator.vue";

const app = inject('ServiceContainer');
const {t} = app.i18n;
const {getStore, setStore} = app.storage;

const treeViewWidth = ref(190);
const pinnedFoldersOpened = ref(getStore('pinned-folders-opened', true));
watch(pinnedFoldersOpened, (value) => setStore('pinned-folders-opened', value));

const removeFavorite = (item) => {
    app.pinnedFolders = app.pinnedFolders.filter(fav => fav.path !== item.path);
    app.storage.setStore('pinned-folders', app.pinnedFolders);
}

const handleMouseDown = (e) => {
  const startX = e.clientX;
  const element = e.target.parentElement;
  const startWidth = element.getBoundingClientRect().width;

  // start of event remove transition-[width] and add transition-none
  element.classList.remove('transition-[width]');
  element.classList.add('transition-none');

  const handleMouseMove = (e) => {
    treeViewWidth.value = startWidth + e.clientX - startX;

    if (treeViewWidth.value < 50) {
        treeViewWidth.value = 0;
        app.showTreeView = false;
    }
    if (treeViewWidth.value > 50) {
        app.showTreeView = true;
    }
  };

  const handleMouseUp = () => {
    // get the actual width of the element, update the treeViewWidth
    const elementData = element.getBoundingClientRect();
    treeViewWidth.value = elementData.width;
    // end of event add transition-[width] and remove transition-none
    element.classList.add('transition-[width]');
    element.classList.remove('transition-none');
    // remove event listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // add event listeners
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);

}
const treeViewScrollElement = ref(null);

onMounted(() => {
  OverlayScrollbars(treeViewScrollElement.value, {
      overflow: {
        x: 'hidden',
      },
      scrollbars: {
          theme: 'vf-theme-dark dark:vf-theme-light',
      },
  });
});

// watch for changes in the fs.data
// update the treeViewData
watch(app.fs.data, (newValue, oldValue) => {
    const folders = newValue.files.filter(e => e.type === 'dir');

    upsert(app.treeViewData, {path: app.fs.path, folders: folders.map((item) => {
        return {
            adapter: item.storage, 
            path: item.path, 
            basename: item.basename
        }
    })})
});

</script>
