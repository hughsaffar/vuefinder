<template>
  <div class="vuefinder__explorer">
    <div v-if="app.view === 'list' || searchQuery.length" class="vuefinder__explorer__table">
      <div @click="sortBy('basename')" class="vuefinder__explorer__table__name_column vf-sort-button">
        {{ t('Name') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'basename'"/>
      </div>
      <div v-if="!searchQuery.length" @click="sortBy('file_size')" class="vuefinder__explorer__table__size_column vf-sort-button">
        {{ t('Size') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'file_size'"/>
      </div>
      <div v-if="!searchQuery.length" @click="sortBy('last_modified')" class="vuefinder__explorer__table__date_column vf-sort-button">
        {{ t('Date') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'last_modified'"/>
      </div>
      <div v-if="searchQuery.length" @click="sortBy('path')" class="vuefinder__explorer__table__path_column vf-sort-button">
        {{ t('Filepath') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'path'"/>
      </div>
    </div>

    <div class="relative">
      <DragItem ref="dragImage" :count="ds.getCount()"/>
    </div>

    <div :ref="ds.scrollBarContainer" class="vf-explorer-scrollbar-container" :class="[{'grid-view': app.view === 'grid'}, {'search-active': searchQuery.length}]">
      <div :ref="ds.scrollBar" class="viewfinder__explorer__scrollbar pointer-events-none"></div>
    </div>

    <div :ref="ds.area"
         class="vuefinder__explorer__area vf-explorer-scrollbar vf-selector-area"
         @contextmenu.self.prevent="app.emitter.emit('vf-contextmenu-show',{event: $event, items: ds.getSelected()})"
    >

      <!-- Search View -->
      <Item v-if="searchQuery.length" v-for="(item, index) in getItems()"
            :item="item" :index="index" :dragImage="dragImage" class="vf-item vf-item-list">
        <div class="vuefinder__explorer__search">
          <div class="vuefinder__explorer__search__item">
            <ItemIcon :type="item.type" :small="app.compactListView"/>
            <span class="vuefinder__explorer__search__item__name">{{ item.basename }}</span>
          </div>
          <div class="vuefinder__explorer__search__item__path">{{ item.path }}</div>
        </div>
      </Item>
      <!-- List View -->
      <Item v-if="app.view==='list' && !searchQuery.length" v-for="(item, index) in getItems()"
            :item="item" :index="index" :dragImage="dragImage" class="vf-item vf-item-list" draggable="true" :key="item.path">
        <div class="vuefinder__explorer__list">
          <div class="vuefidner__explorer__list__item">
            <ItemIcon :type="item.type" :small="app.compactListView"/>
            <span class="vuefinder__explorer__list__item__name">{{ item.basename }}</span>
          </div>
          <div class="vuefinder__explorer__list__item__size">{{ item.file_size ? app.filesize(item.file_size) : '' }}</div>
          <div class="vuefinder__explorer__list__item__date">
            {{ datetimestring(item.last_modified) }}
          </div>
        </div>
      </Item>
      <!-- Grid View -->
      <Item v-if="app.view==='grid' && !searchQuery.length" v-for="(item, index) in getItems(false)"
            :item="item" :index="index" :dragImage="dragImage" class="vf-item vf-item-grid" draggable="true">
        <div>
          <div class="relative">
            <img src="data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                 class="lazy vuefinder__explorer__grid__image" v-if="(item.mime_type ?? '').startsWith('image') && app.showThumbnails"
                 :data-src="app.requester.getPreviewUrl(app.fs.adapter, item)" :alt="item.basename" :key="item.path">
            <ItemIcon :type="item.type" v-else/>
            <div class="vuefinder__explorer__grid__ext"
                 v-if="!((item.mime_type ?? '').startsWith('image') && app.showThumbnails) && item.type !== 'dir'" >
              {{ ext(item.extension) }}
            </div>
          </div>

          <span class="vuefinder__explorer__grid__name">{{ title_shorten(item.basename) }}</span>
        </div>
      </Item>
    </div>

    <Toast/>
  </div>
</template>

<style>
.vuefinder__explorer {
  @apply relative flex-auto flex flex-col;
}

.vuefinder__explorer__table {
  @apply grid grid-cols-12 px-1 bg-neutral-50 dark:bg-gray-800 border-b border-neutral-300 dark:border-gray-700 text-xs select-none divide-x;
}

.vuefinder__explorer__table__name_column {
  @apply col-span-7;
}

.vuefinder__explorer__table__size_column {
  @apply justify-center col-span-2;
}

.vuefinder__explorer__table__date_column {
  @apply justify-center col-span-3;
}

.vuefinder__explorer__table__path_column {
  @apply justify-center col-span-5;
}

.vuefinder__explorer__scrollbar {
  @apply w-5 bg-transparent;
}

.vuefinder__explorer__area {
  @apply h-full w-full text-xs p-1 z-0 overflow-y-auto;
}

.vuefinder__explorer__search {
  @apply grid grid-cols-12 items-center;
}

.vuefinder__explorer__search__item {
  @apply flex col-span-7 items-center;
}

.vuefinder__explorer__search__item__name {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

.vuefinder__explorer__search__item__path {
  @apply col-span-5 overflow-ellipsis overflow-hidden whitespace-nowrap;
}

.vuefinder__explorer__list {
  @apply grid grid-cols-12 items-center;
}

.vuefinder__explorer__list__item {
  @apply flex col-span-7 items-center;
}

.vuefinder__explorer__list__item__name {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

.vuefinder__explorer__list__item__size {
  @apply col-span-2 text-center;
}

.vuefinder__explorer__list__item__date {
  @apply col-span-3 overflow-ellipsis overflow-hidden whitespace-nowrap px-1 md:px-3;
}

.vuefinder__explorer__grid__image {
  @apply h-10 md:h-12 m-auto;
}

.vuefinder__explorer__grid__ext {
  @apply absolute hidden md:block top-1/2 w-full text-center text-neutral-500;
}

.vuefinder__explorer__grid__name {
  @apply break-all;
}
</style>

<script setup>
import {inject, onBeforeUnmount, onMounted, onUpdated, reactive, ref} from 'vue';
import datetimestring from '../utils/datetimestring.js';
import title_shorten from "../utils/title_shorten.js";
import Toast from './Toast.vue';
import LazyLoad from 'vanilla-lazyload';
import SortIcon from "./SortIcon.vue";
import ItemIcon from "./ItemIcon.vue";
import DragItem from "./DragItem.vue";
import Item from "./Item.vue";


const app = inject('ServiceContainer');
const {t} = app.i18n;

const ext = (item) => item?.substring(0, 3)
const dragImage = ref(null);

const searchQuery = ref('');
const ds = app.dragSelect;

/** @type {import('vanilla-lazyload').ILazyLoadInstance} */
let vfLazyLoad

app.emitter.on('vf-fullscreen-toggle', () => {
  ds.area.value.style.height = null;
});

app.emitter.on('vf-search-query', ({newQuery}) => {
  searchQuery.value = newQuery;

  if (newQuery) {
    app.emitter.emit('vf-fetch', {
      params: {
        q: 'search',
        adapter: app.fs.adapter,
        path: app.fs.data.dirname,
        filter: newQuery
      },
      onSuccess: (data) => {
        if (!data.files.length) {
          app.emitter.emit('vf-toast-push', {label: t('No search result found.')});
        }
      }
    });
  } else {
    app.emitter.emit('vf-fetch', {params: {q: 'index', adapter: app.fs.adapter, path: app.fs.data.dirname}});
  }
});

const sort = reactive({active: false, column: '', order: ''});

const getItems = (sorted = true) => {
  let files = [...app.fs.data.files],
      column = sort.column,
      order = sort.order === 'asc' ? 1 : -1;

  if (!sorted) {
    return files;
  }

  const compare = (a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  if (sort.active) {
    files = files.slice().sort((a, b) => compare(a[column], b[column]) * order);
  }

  return files;
};

const sortBy = (column) => {
  if (sort.active && sort.column === column) {
    sort.active = sort.order === 'asc'
    sort.column = column
    sort.order = 'desc'
  } else {
    sort.active = true
    sort.column = column
    sort.order = 'asc'
  }
};


onMounted(() => {
  vfLazyLoad = new LazyLoad(ds.area.value);
});

onUpdated(() => {
  vfLazyLoad.update();
});

onBeforeUnmount(() => {
  vfLazyLoad.destroy();
});

</script>
