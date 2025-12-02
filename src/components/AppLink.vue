<script setup>
import { computed } from 'vue'
import { RouterLink, useLink } from 'vue-router'

const props = defineProps({
  ...RouterLink.props,
  inactiveClass: {
    type: String,
    default: '',
  },
  activeClass: {
    type: String,
    default: 'is-active',
  },
  exactActiveClass: {
    type: String,
    default: 'is-exact-active',
  },
})

const { navigate, href, isActive, isExactActive } = useLink(props)

const classes = computed(() => {
  return [
    props.inactiveClass,
    isActive.value && props.activeClass,
    isExactActive.value && props.exactActiveClass,
  ]
})
</script>

<template>
  <a :href="href" @click="navigate" :class="classes">
    <slot />
  </a>
</template>
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
</style>
