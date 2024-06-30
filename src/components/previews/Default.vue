<template>
  <div class="flex">
    <h3 class="vuefinder__default_preview_modal__title" id="modal-title"
         :title="app.modal.data.item.path">{{ app.modal.data.item.basename }}</h3>
  </div>
  <div></div>
</template>

<style>

.vuefinder__default_preview_modal__title {
  @apply mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400l;
}

</style>

<script setup>

import {onMounted, inject} from 'vue';

const app = inject('ServiceContainer');

const emit = defineEmits(['success']);

onMounted(() => {
  emit('success');
});
</script>
