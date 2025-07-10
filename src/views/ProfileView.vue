<template>
  <section class="page-profile">
    <h2 class="page-profile__info-title">Profile</h2>

    <div class="page-profile__fields">
      <div
        v-for="(field, key) in fields"
        :key="key"
        class="page-profile__fields-item"
      >
        <div class="page-profile__fields-label">
          <h3>{{ field.label }}</h3>
        </div>
        <UiInput
          v-model="field.value.value"
          :placeholder="field.label"
          :type="'text'"
          :validation="v$[key]"
          :id="key"
          :iconName="field.isEditing.value ? 'close-square' : 'edit'"
          :disabled="!field.isEditing.value"
          @iconClick="field.isEditing.value ? cancelEdit(key) : toggleEdit(key)"
        />
        <div class="page-profile__fields-actions">
          <UiButton
            :disabled="
              !field.isEditing.value ||
              v$[key].$error ||
              field.value.value === field.originalValue
            "
            @click="submitField(key)"
            label="Submit"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import UiInput from '@/components/UiInput.vue'
import UiButton from '@/components/UiButton.vue'
import { type UserProfileUpdateInfo } from '@/types/auth'
import { application } from '@/application'
import { AppError } from '@/types/app-errors'

type FieldKey = keyof UserProfileUpdateInfo

interface FieldData {
  label: string
  value: Ref<string>
  originalValue: string
  isEditing: Ref<boolean>
}

const fields = {
  email: {
    label: 'Email',
    value: ref(application.userProfile?.email ?? ''),
    originalValue: application.userProfile?.email ?? '',
    isEditing: ref(false),
  },
  first_name: {
    label: 'First Name',
    value: ref(application.userProfile?.first_name ?? ''),
    originalValue: application.userProfile?.first_name ?? '',
    isEditing: ref(false),
  },
  last_name: {
    label: 'Last Name',
    value: ref(application.userProfile?.last_name ?? ''),
    originalValue: application.userProfile?.last_name ?? '',
    isEditing: ref(false),
  },
  phone: {
    label: 'Phone',
    value: ref(application.userProfile?.phone ?? ''),
    originalValue: application.userProfile?.phone ?? '',
    isEditing: ref(false),
  },
  bio: {
    label: 'Bio',
    value: ref(application.userProfile?.bio ?? ''),
    originalValue: application.userProfile?.bio ?? '',
    isEditing: ref(false),
  },
} satisfies Record<FieldKey, FieldData>

const rules = computed(() => ({
  email: { required, email },
  first_name: { required },
  last_name: { required },
  bio: { required },
  phone: { required },
}))

const state = computed(() => {
  const s: Record<FieldKey, string> = {
    email: fields.email.value.value,
    first_name: fields.first_name.value.value,
    last_name: fields.last_name.value.value,
    phone: fields.phone.value.value,
    bio: fields.bio.value.value,
  }
  return s
})

const v$ = useVuelidate(rules, state)

function toggleEdit(key: FieldKey) {
  fields[key].isEditing.value = true
}

function cancelEdit(key: FieldKey) {
  const field = fields[key]
  field.value.value = field.originalValue
  field.isEditing.value = false
  v$.value[key].$reset()
}

async function submitField(key: FieldKey) {
  const field = fields[key]
  const validation = v$.value[key]
  validation.$touch()

  if (validation.$invalid) return

  if (field.value.value !== field.originalValue) {
    const res = await application.updateProfileInfo({
      [key]: field.value.value,
    })
    if (!(res instanceof AppError)) {
      field.originalValue = field.value.value
    }
  }

  field.isEditing.value = false
  validation.$reset()
}
</script>
<style scoped lang="scss">
.page-profile {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  &__info {
    margin: 0 auto;
    background-color: var(--bg-primary);
    &-title {
      text-align: center;
      padding: 3rem 0;
    }
  }
  &__fields {
    display: flex;
    text-align: center;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
    background-color: var(--bg-primary);
    padding: 2.4rem 2rem 1.2rem 2rem;
    width: 300px;
    margin: auto auto;
    border-radius: 1rem;
  }
  &__fields-label > {
    h3 {
      padding: 0.5rem;
      font-size: 1.25rem;
    }
  }
}

@include media-query('tablet') {
  .page-profile__fields {
    width: 600px;
    text-align: left;
  }
  .page-profile__fields-item {
    display: grid;
    grid-template-columns: 0.5fr 1fr auto;
    align-items: flex-start;
    gap: 2rem;
  }
}
</style>
