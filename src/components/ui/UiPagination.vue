<template>
  <div v-if="pages > 1" class="ui-pagination">
    <UiButtonIcon
      @click="$emit('firstPage')"
      :disabled="page <= 1"
      iconName="left-arrow"
      class="ui-pagination__arrows arrow-left"
    />

    <UiButton
      v-for="_page in pages"
      :key="_page"
      :class="['ui-pagination__buttons', { _active: page === _page }]"
      @click="$emit('btnPage', _page)"
      :label="`${_page}`"
    />
    <UiButtonIcon
      @click="$emit('latestPage')"
      :disabled="page >= pages"
      class="ui-pagination__arrows arrow-right"
      iconName="right-arrow"
    />
  </div>
</template>

<script lang="ts" setup>
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'

interface Pagination {
  page: number
  pages: number
}
defineOptions({
  name: 'UiPagination',
})

withDefaults(defineProps<Pagination>(), {
  page: 1,
  pages: 1,
})
</script>
<style lang="scss" scoped>
.ui-pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  padding: rem(30) 0;
  &__buttons {
    &._active {
      :deep(.ui-button__content) {
        color: var(--active-primary);
      }
    }
  }
  :deep(.ui-button__content) {
    font-size: 1.5rem;
    color: var(--text-active-primary);
  }
  :deep(.ui-button) {
    min-width: 2.5rem;
  }
}
</style>
