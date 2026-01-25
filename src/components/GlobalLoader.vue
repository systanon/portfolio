<template>
  <Teleport to="body">
    <div class="global-loader" v-if="loading">
      <UiIcon
        v-if="loading"
        name="quantum-loader"
        :width="rem(80)"
        :height="rem(80)"
      />
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import { rem } from '@/utils/rem'
import UiIcon from '@/components/ui/icons/UiIcon.vue'
import { useLoading } from '@/composables/useLoading'

const { loading } = useLoading()
</script>

<style scoped>
.global-loader {
  position: fixed;
  inset: 0;
  background: var(--backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease;
}
</style>
