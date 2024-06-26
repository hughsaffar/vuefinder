<template>
  <div class="vuefinder__folder_indicator">
    <div class="vuefinder__folder_indicator__wrapper">
      <SquareMinusSVG class="vuefinder__folder_indicator__minus_icon" v-if="model" />
      <SquarePlusSVG class="vuefinder__folder_indicator__plus_icon" v-if="!model" />
    </div>
  </div>
</template>

<style>
.vuefinder__folder_indicator {
  @apply h-5 w-5 shrink-0;
}

.vuefinder__folder_indicator__wrapper {
  @apply cursor-pointer;
}

.vuefinder__folder_indicator__minus_icon {
  @apply text-gray-600;
}

.vuefinder__folder_indicator__plus_icon {
  @apply text-gray-400;
}
</style>


<script setup>
import SquarePlusSVG from "./icons/plus.svg";
import SquareMinusSVG from "./icons/minus.svg";

const model = defineModel();

</script>

