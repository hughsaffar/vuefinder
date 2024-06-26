<template>
  <div class="vuefinder__statusbar">
    <div class="vuefinder__statusbar__left">
      <div class="vuefinder__statusbar__left__item" :title="t('Storage')">
        <div class="vuefinder__statusbar__left__item__icon">
          <StorageSVG/>
        </div>
        <select v-model="app.fs.adapter" @change="handleStorageSelect"
                class="vuefinder__statusbar__left__item__select" tabindex="-1">
          <option v-for="storage in app.fs.data.storages" :value="storage" class="vuefinder__statusbar__left__item__select__option">
            {{ storage }}
          </option>
        </select>
      </div>

     <div class="vurefinder__statusbar__search">
       <span v-if="searchQuery.length">{{ app.fs.data.files.length }} items found. </span>
       <span class="vuefinder__statusbar__search__text">{{ app.dragSelect.getCount() > 0 ? t('%s item(s) selected.', app.dragSelect.getCount()) : '' }}</span>
     </div>
    </div>
    <div class="vuefinder__statusbar__right">
      <button class="vuefinder__statusbar__right__item vf-btn vf-btn-primary"
              :class="{disabled: !isSelectButtonActive}"
              :disabled="!isSelectButtonActive"
              v-if="app.selectButton.active" @click="app.selectButton.click(ds.getSelected(), $event)">{{ t("Select") }}</button>

      <span class="vuefinder__statusbar__about" :title="t('About')" @click="app.modal.open(ModalAbout)">
        <AboutSVG />
      </span>
    </div>
  </div>
</template>

<style>
.vuefinder__statusbar {
  @apply p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none grow-0;
}

.vuefinder__statusbar__left {
  @apply flex leading-5 items-center;
}

.vuefinder__statusbar__left__item {
  @apply flex leading-5 items-center rounded border dark:bg-gray-700 dark:border-gray-600;
}

.vuefinder__statusbar__left__item__icon {
  @apply z-[1] pointer-events-none;
}

.vuefinder__statusbar__left__item__select {
  @apply border-0 py-0.5 text-xs text-slate-500 bg-white dark:text-neutral-50 dark:bg-gray-700 rounded uppercase focus:outline-0 cursor-pointer;
}

.vuefinder__statusbar__search {
  @apply ml-3;
}

.vuefinder__statusbar__search__text {
  @apply ml-1;
}

.vuefinder__statusbar__right {
  @apply flex leading-5 items-center justify-end;
}

.vuefinder__statusbar__right__item {
  @apply py-0 ;
}

.vuefinder__statusbar__about {
  @apply mr-1;
}
</style>

<script setup>
import {computed, inject, ref} from 'vue';
import ModalAbout from "./modals/ModalAbout.vue";
import StorageSVG from "./icons/storage.svg";
import AboutSVG from "./icons/about.svg";

const app = inject('ServiceContainer');
const {t} = app.i18n;
const {setStore} = app.storage;
const  ds = app.dragSelect;

const handleStorageSelect = () => {
  app.emitter.emit('vf-search-exit');
  app.emitter.emit('vf-fetch', {params:{q: 'index', adapter: app.fs.adapter}});
  setStore('adapter', app.fs.adapter);
};

const searchQuery = ref('');

app.emitter.on('vf-search-query', ({newQuery}) => {
  searchQuery.value = newQuery;
});

const isSelectButtonActive = computed(() => {
  const selectionAllowed = app.selectButton.multiple ? ds.getSelected().length > 0 : ds.getSelected().length === 1;
  return app.selectButton.active && selectionAllowed;
});

</script>

