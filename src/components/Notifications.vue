<template>
  <div class="notification-messages">
    <div
      v-for="[id, n] in notifications"
      :key="id"
      :class="['notification-messages__item', n.type]"
    >
      <UiLittleKip :text="n.message" />

      <UiButtonIcon
        class="notification-messages__item-action"
        icon-name="close-square"
        @click="notifications.delete(id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { application } from '@/application'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiLittleKip from '@/components/ui/UiLittleKip.vue'

const notifications = application.notifications
</script>
<style lang="scss" scoped>
.notification-messages {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    min-width: 250px;
    max-width: 350px;

    &.success {
      background-color: var(--success);
    }

    &.error {
      background-color: var(--error);
    }

    &.info {
      background-color: var(--info);
    }
  }
}
</style>
