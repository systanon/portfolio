<template>
  <div class="card-component">
    <UiIcon
      :name="iconName"
      color="secondary"
      :width="rem(width)"
      :height="rem(height)"
    />
    <slot />
  </div>
</template>
<script setup lang="ts">
import { rem } from '@/utils/rem'
import UiIcon from './ui/icons/UiIcon.vue'

defineProps<{
  iconName: string
  width: number
  height: number
}>()
</script>

<style lang="scss" scoped>
.card-component {
  display: flex;
  flex-direction: column;
  background: $backdrop-color;
  backdrop-filter: blur($blur-filter);
  -webkit-backdrop-filter: blur($blur-filter);
  align-items: center;
  flex: 1;
  padding: rem(55);
  gap: rem(30);
}
</style>
