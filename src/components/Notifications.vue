<template>
  <div class="notification-messages">
    <div
      v-for="[id, { type, message }] of notifications"
      :key="id"
      :class="['notification-messages__item', type]"
    >
      <p class="notification-messages__item-text">{{ message }}</p>

      <UiButtonIcon
        class="notification-messages__item-action"
        icon-name="close-square"
        :with-border="false"
        @click="remove(id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import { useNotifications } from '@/composables/useNotifications'

const { notifications, remove } = useNotifications()
</script>
<style lang="scss" scoped>
.notification-messages {
  position: fixed;
  top: rem(16);
  z-index: 105;
  display: flex;
  flex-direction: column;
  gap: rem(5);
  width: 100%;
  &__item {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(8) rem(16);
    border-radius: rem(8);
    width: 100%;
    max-width: rem(450);

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
