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
      class="ui-pagination__buttons"
      :class="{ _active: page === _page }"
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

<script lang="ts">
  import { defineComponent } from 'vue';
  import UiButtonIcon from './UiButtonIcon.vue';
  import UiButton from './UiButton.vue';
  export default defineComponent({
    name: 'UiPagination',
    components: {
      UiButtonIcon,
      UiButton,
    },
    props: {
      page: {
        type: Number,
        default: 1,
      },
      pages: {
        type: Number,
        default: 1,
      },
    },
  });
</script>
<style lang="scss" scoped>
  .ui-pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
    & ._active {
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
