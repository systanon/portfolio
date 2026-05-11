<template>
  <section class="about-page">
    <h2 class="about-page__title">{{ t('page_about.title') }}</h2>

    <div class="about-page__description">
      <p class="about-page__description-text">
        {{ t('page_about.description') }}
      </p>
      <UiButtonIcon @click="openForm" iconName="download">
        <template #prepend>
          <span> {{ t('page_about.btn_description') }}</span>
        </template>
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
import { AppSuccess } from '@/types/app.types'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AboutView',
})

const { t } = useI18n()
const cvModalRef = ref<IModalOpen | null>(null)
const cvFormRef = ref()
const { statisticApplication } = application
const submitForm = async () => {
  const data = await cvFormRef.value?.validateAndGet()
  if (!data) return

  const res = await statisticApplication.getCV(data)
  if (res instanceof AppSuccess) {
    cvModalRef.value?.confirm(true)
  }
}

const openForm = () => {
  cvModalRef.value?.open()
}
</script>

<style scoped lang="scss">
.about-page {
  text-align: center;
  &__title {
    color: var(--text-color-primary);
    text-shadow: var(--text-shadow);
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
