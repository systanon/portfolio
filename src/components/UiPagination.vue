<template>
  <div class="ui-pagination">
    <button
      @click="$emit('firstPage')"
      :disabled="page <= 1"
      class="ui-pagination__arrows arrow-left"
      transparent
    ><</button>

    <button
      v-for="_page in pages"
      :key="_page"
      class="ui-pagination__buttons"
      :class="{ _active: page === _page }"
      @click="$emit('btnPage', _page)"
      :label="`${_page}`"
      variant="rounded"
    >{{ _page }}</button>
    <button
      @click="$emit('latestPage')"
      :disabled="page >= pages"
      class="ui-pagination__arrows arrow-right"
      transparent
    >></button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "UiPagination",
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
  & ._active {
    background-color: orange;
  }
}
</style>
