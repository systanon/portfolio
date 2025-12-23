<template>
  <svg class="ui-icon">
    <use :xlink:href="localHref" height="100%" width="100%"></use>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
const DEFAULT_ICON_NAME = 'default'
export default defineComponent({
  name: 'UIIcon',
  props: {
    href: { type: String },
    name: { type: String },
  },
  computed: {
    localHref() {
      return this.href || `#${this.name || DEFAULT_ICON_NAME}`
    },
  },
})
</script>
<style lang="scss" scoped>
.ui-icon {
  height: rem(22);
  width: rem(22);
  color: var(--text-color-primary);
  fill: currentColor;
}
</style>
