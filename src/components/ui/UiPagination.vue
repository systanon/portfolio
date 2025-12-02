<template>
  <div v-if="pages > 1" class="ui-pagination">
    <UiButtonIcon
      @click="$emit('firstPage')"
      :disabled="page <= 1"
      iconName="left-arrow"
      class="ui-pagination__arrows arrow-left"
    />

    <UiButton
      v-if="pages > VISIBLE_PAGES"
      :class="['ui-pagination__buttons', { _active: page === 1 }]"
      @click="$emit('btnPage', 1)"
      :label="'1'"
    />

    <span
      v-if="pages > VISIBLE_PAGES && page > range + 2"
      class="ui-pagination__dots"
      >...</span
    >

    <UiButton
      v-for="_page in visiblePages"
      :key="_page"
      :class="['ui-pagination__buttons', { _active: page === _page }]"
      @click="$emit('btnPage', _page)"
      :label="`${_page}`"
    />

    <span
      v-if="pages > VISIBLE_PAGES && page < pages - (range + 1)"
      label="..."
      class="ui-pagination__dots"
      >...</span
    >

    <UiButton
      v-if="pages > VISIBLE_PAGES"
      :class="['ui-pagination__buttons', { _active: page === pages }]"
      @click="$emit('btnPage', pages)"
      :label="`${pages}`"
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
import { computed } from 'vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'

const VISIBLE_PAGES = 7

interface Pagination {
  page: number
  pages: number
  range?: number
}
defineOptions({
  name: 'UiPagination',
})

const props = withDefaults(defineProps<Pagination>(), {
  page: 1,
  pages: 1,
  range: 2,
})

const visiblePages = computed(() => {
  if (props.pages <= VISIBLE_PAGES) {
    return Array.from({ length: props.pages }, (_, i) => i + 1)
  }

  const start = Math.max(2, props.page - props.range)
  const end = Math.min(props.pages - 1, props.page + props.range)

  const range: number[] = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
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
  &__dots {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: rem(40);
    color: var(--text-active-primary);
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
