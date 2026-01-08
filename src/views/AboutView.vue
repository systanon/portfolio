<template>
  <section class="about-page">
    <h2 class="about-page__title">About Me</h2>

    <div class="about-page__description">
      <p class="about-page__description-text">
        My name is Serhii Tustanovskyi, and I am a Front-End Developer with over
        4 years of professional experience. I specialize in building complex web
        applications, including crypto trading platforms, e-commerce systems,
        and internal frameworks. My primary stack is Vue.js, TypeScript, and
        modern frontend tooling. I focus on clean UI/UX implementation,
        pixel-perfect layouts, reusable components, and maintainable frontend
        architecture. I actively apply best practices such as SOLID, DRY, and
        KISS to deliver scalable and reliable solutions. In addition to frontend
        development, I have hands-on experience with backend technologies,
        including Golang and REST APIs, which helps me effectively collaborate
        with backend and DevOps teams and better understand full application
        architecture. For a detailed overview of my professional experience,
        projects, and technical skills. please download my CV.
      </p>
      <UiButtonIcon @click="openForm" iconName="download">
        <template #prepend> <span>Download CV</span> </template>
      </UiButtonIcon>
    </div>
  </section>

  <UIModal ref="cvModalRef" title="Download CV" class="about-page__modal">
    <template #default>
      <div class="about-page__modal-form update-todo-form">
        <UiInput
          v-model="statistic.company_name"
          type="text"
          placeholder="Company name"
          :validation="v$.company_name"
          @blur="v$.company_name.$touch"
        />
        <UiInput
          v-model="statistic.contact_name"
          type="text"
          placeholder="Contact name"
          :validation="v$.contact_name"
          @blur="v$.contact_name.$touch"
        />
        <UiInput
          v-model="statistic.email"
          type="text"
          placeholder="Email"
          :validation="v$.email"
          @blur="v$.email.$touch"
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
import { ref, reactive } from 'vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import { useValidationRules } from '@/composables/useValidationRules'
import useVuelidate from '@vuelidate/core'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiInput from '@/components/ui/fields/UiInput.vue'
import { application } from '@/application'
import type { StatisticDTO } from '@/types/statistic'
import { AppError } from '@/types/app-errors'

defineOptions({
  name: 'AboutView',
})

const cvModalRef = ref<IModalOpen | null>(null)

const { emailRules, contactNameRules, companyNameRules } = useValidationRules()

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

const sendStatistic = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  const res = await application.saveStatistic(statistic)
  if (!(res instanceof AppError)) {
    cvModalRef.value?.confirm(true)
    resetStatistic()
    v$.value.$reset()
  }
}
const openForm = async () => {
  const confirm = await cvModalRef.value?.open()
  if (!confirm) {
    resetStatistic()
    v$.value.$reset()
  }
}
</script>

<style scoped lang="scss">
.about-page {
  text-align: center;
  &__title {
    color: var(--text-color-primary);
    text-shadow: $text-shadow;
    padding-bottom: rem(40);
  }
  &__description {
    background-color: var(--bg-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(16);
    margin: 0 auto;
    padding: rem(45);
  }
  &__description-text {
    line-height: rem(35);
    font-size: rem(18);
  }
}
</style>
