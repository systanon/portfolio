<template>
  <button :disabled="disabled" class="ui-button-icon">
    <UIIcon :name="iconName" />
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import UIIcon from '@/components/UiIcon.vue'

  export default defineComponent({
    components: { UIIcon },
    name: 'UiButtonIcon',
    props: {
      value: {
        type: [Boolean, String, Number],
        default: false,
      },
      iconName: {
        type: String,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>

<style lang="scss" scoped>
  .ui-button-icon {
    padding: 0.5rem;
    border: none;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: transparent;
    &:disabled {
      pointer-events: none;
    }
  }
</style>
