<template>
  <span ref="textRef" class="little-kip" v-tooltip="showTooltip ? text : ''">
    {{ text }}
  </span>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

interface Props {
  text: string
}

const { text } = defineProps<Props>()

const textRef = ref<HTMLElement | null>(null)
const showTooltip = ref(false)
let resizeObserver: ResizeObserver

const checkOverflow = (): void => {
  const el = textRef.value
  if (!el) return
  showTooltip.value = el.scrollWidth > el.clientWidth
}

onMounted(() => {
  const el = textRef.value
  if (!el) return

  resizeObserver = new ResizeObserver(checkOverflow)
  resizeObserver.observe(el)

  checkOverflow()
})

onBeforeUnmount(() => {
  if (resizeObserver && textRef.value) {
    resizeObserver.unobserve(textRef.value)
    resizeObserver.disconnect()
  }
})

watch(
  () => text,
  () => {
    checkOverflow()
  }
)
</script>

<style lang="scss" scoped>
.little-kip {
  @include truncate-one-line;
  display: inline-block;
  max-width: 100%;
}
</style>
