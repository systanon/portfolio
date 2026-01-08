<template>
  <UiInput
    v-model="statistic.company_name"
    placeholder="Company name"
    :validation="v$.company_name"
    @blur="v$.company_name.$touch"
  />
  <UiInput
    v-model="statistic.contact_name"
    placeholder="Contact name"
    :validation="v$.contact_name"
    @blur="v$.contact_name.$touch"
  />
  <UiInput
    v-model="statistic.email"
    placeholder="Email"
    :validation="v$.email"
    @blur="v$.email.$touch"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useValidationRules } from '@/composables/useValidationRules'
import UiInput from '@/components/ui/fields/UiInput.vue'
import type { StatisticDTO } from '@/types/statistic'

defineOptions({
  name: 'CvForm',
})
const { emailRules, contactNameRules, companyNameRules } = useValidationRules()

const statistic = reactive<StatisticDTO>({
  company_name: '',
  contact_name: '',
  email: '',
})

const rules = {
  company_name: companyNameRules,
  contact_name: contactNameRules,
  email: emailRules,
}

const v$ = useVuelidate(rules, statistic)

const validateAndGet = async (): Promise<StatisticDTO | null> => {
  const isValid = await v$.value.$validate()
  if (!isValid) return null
  return { ...statistic }
}

defineExpose({ validateAndGet })
</script>
