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

  <UIModal ref="cvModalRef" title="Download CV">
    <CvForm ref="cvFormRef" />
    <template #actions="{ close }">
      <UiButton @click="close" label="Cancel" />
      <UiButton @click="submitForm" label="Submit" />
    </template>
  </UIModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import CvForm from '@/components/forms/CvForm.vue'
import { application } from '@/application'
import { AppError } from '@/types/app-errors'

defineOptions({
  name: 'AboutView',
})

const cvModalRef = ref<IModalOpen | null>(null)
const cvFormRef = ref()

const submitForm = async () => {
  const data = await cvFormRef.value?.validateAndGet()
  if (!data) return

  const res = await application.saveStatistic(data)
  if (!(res instanceof AppError)) {
    cvModalRef.value?.confirm(true)
  }
}

const openForm = async () => {
  await cvModalRef.value?.open()
}
</script>

<style scoped lang="scss">
.about-page {
  text-align: center;
  &__title {
    padding-top: rem(43);
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
