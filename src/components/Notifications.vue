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
  top: rem(16);
  right: rem(16);
  z-index: 105;
  display: flex;
  flex-direction: column;
  gap: rem(5);
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(8) rem(16);
    border-radius: rem(8);
    min-width: rem(250);
    max-width: rem(350);

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
