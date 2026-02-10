<template>
  <a
    :href="href"
    @click.prevent="emit('navigate', navigate)"
    :class="classes"
    :aria-disabled="disabled"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLink, type RouterLinkProps } from 'vue-router'

const props = withDefaults(
  defineProps<
    RouterLinkProps & {
      disabled?: boolean
      inactiveClass?: string
      activeClass?: string
      exactActiveClass?: string
    }
  >(),
  {
    disabled: false,
    inactiveClass: '',
    activeClass: 'is-active',
    exactActiveClass: 'is-exact-active',
  },
)

const emit = defineEmits<{
  (e: 'navigate', navigate: () => void): void
}>()

const { navigate, href, isActive, isExactActive } = useLink(props)

const classes = computed(() => {
  return [
    props.inactiveClass,
    isActive.value && props.activeClass,
    isExactActive.value && props.exactActiveClass,
    props.disabled && 'link--disabled',
  ]
})
</script>

<style lang="scss" scoped>
.link {
  color: var(--text-color-secondary);
  &--active {
    color: var(--text-active-primary);
  }
  &:hover {
    opacity: $hover;
  }
}
.link-secondary {
  color: var(--text-color-tertiary);

  &:hover {
    opacity: $hover;
  }
}
.link--disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}
</style>
