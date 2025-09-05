<script lang="ts">
import { defineComponent } from 'vue'
import GlobalLoader from '@/components/GlobalLoader.vue'
import Notifications from '@/components/Notifications.vue'
import { useWindowResize } from './composables/useWindowResize'

export default defineComponent({
  components: {
    GlobalLoader,
    Notifications,
  },
  setup() {
    useWindowResize()
  },
})
</script>

<template>
  <router-view />
  <GlobalLoader />
  <Notifications />
</template>
