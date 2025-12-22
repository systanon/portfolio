<template>
  <div class="home-page container">
    <h1 class="home-page__title" :style="{ zIndex: zIndex }">
      Serhii Tustanovskyi
    </h1>
    <h2 class="home-page__sub-title">Frontend Developer (Vue.js)</h2>
    <div class="home-page__description">
      <p class="home-page__description-text">
        I have been working since 2020, specializing in Vue.js. I build complex,
        high-performance web applications with a strong focus on UI/UX,
        scalability, and clean architecture. Experienced in crypto platforms,
        reusable component systems, and cross-browser compatibility.
      </p>
      <UiButton label="Download CV" @click="openForm" />
    </div>
  </div>
  <UIModal ref="cvModalRef" title="Download CV" class="home-page__modal">
    <template #default>
      <div class="page-todo__modal-form update-todo-form">
        <UiInput
          v-model="statistic.company_name"
          type="text"
          placeholder="Company name"
          :validation="v$.company_name"
        />
        <UiInput
          v-model="statistic.contact_name"
          type="text"
          placeholder="Contact name"
          :validation="v$.contact_name"
        />
        <UiInput
          v-model="statistic.email"
          type="text"
          placeholder="Email"
          :validation="v$.email"
        />
      </div>
    </template>
    <template #actions="{ close }">
      <UiButton @click="close" label="Cancel" />
      <UiButton @click="sendStatistic" label="Submit" />
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import { useValidationRules } from '@/composables/useValidationRules'
import useVuelidate from '@vuelidate/core'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import UiInput from '@/components/ui/fields/UiInput.vue'
import { application } from '@/application'
import type { StatisticDTO } from '@/types/statistic'

const cvModalRef = ref<IModalOpen | null>(null)

const { emailRules, contactNameRules, companyNameRules } = useValidationRules()

const DEFAULT_Z_INDEX = -4
const statistic = reactive<StatisticDTO>({
  company_name: '',
  contact_name: '',
  email: '',
})

const rules = {
  company_name: contactNameRules,
  contact_name: companyNameRules,
  email: emailRules,
}

const v$ = useVuelidate(rules, statistic)

const resetStatistic = () => {
  Object.assign(statistic, {
    company_name: '',
    contact_name: '',
    email: '',
  })
}

const zIndex = ref<number>(DEFAULT_Z_INDEX)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const handleMouseMove = (): void => {
  zIndex.value = 10
  if (timeoutId !== null) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    zIndex.value = DEFAULT_Z_INDEX
  }, 500)
}

const sendStatistic = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  await application.saveStatistic(statistic)
  cvModalRef.value?.confirm(true)
}
const openForm = async () => {
  const confirm = await cvModalRef.value?.open()
  if (!confirm) {
    v$.value.$reset()
    resetStatistic()
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (timeoutId !== null) clearTimeout(timeoutId)
})
</script>

<style scoped lang="scss">
.home-page {
  text-align: center;
  &__title {
    color: var(--text-color-primary);
    text-shadow: $text-shadow;

    position: relative;
  }
  &__sub-title {
    color: var(--text-color-primary);
    text-shadow: $text-shadow;
    padding-bottom: rem(80);
  }
  &__description {
    background-color: var(--bg-primary);
    margin: 0 auto;
    padding: rem(45);
    max-width: rem(550);
    &-text {
      line-height: rem(35);
      font-size: rem(18);
    }
  }
}

@include media-query('tablet') {
  .home-page {
    &__title {
      font-size: rem(150);
    }
    &__sub-title {
      font-size: rem(50);
    }
  }
}
</style>
