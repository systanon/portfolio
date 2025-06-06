<template>
  <Teleport to=".modal-portal-target">
    <div v-bind="$attrs" class="ui-modal">
      <div
        v-if="isOpen"
        :class="['ui-modal__backdrop', { _opened: showBackdrop }]"
        @click="close"
      >
        <div :class="['ui-modal__dialog', { _opened: show }]" @click.stop>
          <template v-if="title">
            <h2>{{ title }}</h2>
            <hr />
          </template>
          <slot></slot>
          <hr />
          <div class="ui-modal__actions">
            <slot name="actions" :close="close" :confirm="confirm">
              <button @click="close" >Cancel</button>
              <button @click="confirm(true)">Ok</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, defineExpose } from "vue";
import { delay } from "@/helpers/delay";

export type ModalOpen<T = any> = () => Promise<null | T>;
export interface IModalOpen<T = boolean> {
  open: ModalOpen<T>;
}

defineProps<{
  title?: string;
}>();

const isOpen = ref(false);
const showBackdrop = ref(false);
const show = ref(false);

let resolver: ((...args: any[]) => void) | null = null;

const open = async (): Promise<any> => {
  isOpen.value = true;
  await delay(0);
  showBackdrop.value = true;
  await delay(700);
  show.value = true;

  return new Promise((res) => {
    resolver = res;
  });
};

const confirm = async (...params: any[]) => {
  if (resolver) resolver(...params);
  show.value = false;
  await delay(500);
  showBackdrop.value = false;
  await delay(1000);
  isOpen.value = false;
};

const close = () => {
  confirm(null);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (isOpen.value && e.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});

defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.ui-modal {
  &__backdrop {
    background-color: rgba(0, 0, 0, 0.8);
    left: 50%;
    position: fixed;
    height: 1px;
    top: 50%;
    z-index: 100;
    transform: translate(-50%, -50%);
    transition: width 0.5s ease 0.5s, height 0.5s ease;
    width: 0;
    &._opened {
      height: 100%;
      width: 100%;
      transition: width 0.5s ease, height 0.5s ease 0.5s;
    }
  }
  &__dialog {
    background-color: white;
    border-radius: 10px;
    left: 50%;
    padding: 20px;
    position: fixed;
    transform: translate(-50%, -50%);
    z-index: 101;
    top: 50%;
    opacity: 0;
    transition: all 0.5s ease-in-out;

    &._opened {
      opacity: 1;
      transition: all 1s ease-in-out;
    }
  }
  h1 {
    margin: 0;
    text-align: center;
  }
  &__actions {
    display: flex;
    gap: 1em;
    justify-content: end;
    text-align: right;
  }
}
</style>
