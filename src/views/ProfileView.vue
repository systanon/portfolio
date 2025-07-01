<template>
  <section class="page-profile">
    <h2 class="page-profile__title">Profile</h2>
    <section class="page-profile__info">
      <div v-for="(field, key) in fields" :key="key" class="page-profile__fields">
        <div class="page-profile__fields-item">
          <UiInput
            v-model="field.value.value"
            :label="field.label"
            :placeholder="field.label"
            :type="'text'"
            :validation="v$[key]"
            :id="key"
            :disabled="!field.isEditing.value"
          />
          <div class="page-profile__fields-actions">
            <UiButtonIcon v-if="!field.isEditing.value" @click="toggleEdit(key)" iconName="edit" />

            <template v-else>
              <UiButtonIcon @click="cancelEdit(key)" iconName="close-square" />
              <UiButtonIcon @click="submitField(key)" iconName="submit" />
            </template>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, type Ref } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { required, email } from '@vuelidate/validators';
  import UiInput from '@/components/UiInput.vue';
  import UiButtonIcon from '@/components/UiButtonIcon.vue';
  import { type UserProfileUpdateInfo } from '@/types/auth';
  import { application } from '@/application';
  import { AppError } from '@/types/app-errors';

  type FieldKey = keyof UserProfileUpdateInfo;

  interface FieldData {
    label: string;
    value: Ref<string>;
    originalValue: string;
    isEditing: Ref<boolean>;
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
    //TODO:use correct formating for birth_date
    // birth_date: {
    //   label: 'Birth date',
    //   value: ref(application.userProfile?.birth_date ?? ''),
    //   originalValue: application.userProfile?.birth_date ?? '',
    //   isEditing: ref(false),
    // },
  } satisfies Record<FieldKey, FieldData>;

  const rules = computed(() => ({
    email: { required, email },
    first_name: { required },
    last_name: { required },
    bio: { required },
    phone: { required },
    // birth_date: { required },
  }));

  const state = computed(() => {
    const s: Record<FieldKey, string> = {
      email: fields.email.value.value,
      first_name: fields.first_name.value.value,
      last_name: fields.last_name.value.value,
      phone: fields.phone.value.value,
      bio: fields.bio.value.value,
      // birth_date: fields.birth_date.value.value,
    };
    return s;
  });

  const v$ = useVuelidate(rules, state);

  function toggleEdit(key: FieldKey) {
    fields[key].isEditing.value = true;
  }

  function cancelEdit(key: FieldKey) {
    const field = fields[key];
    field.value.value = field.originalValue;
    field.isEditing.value = false;
    v$.value[key].$reset();
  }

  async function submitField(key: FieldKey) {
    const field = fields[key];
    const validation = v$.value[key];
    validation.$touch();

    if (validation.$invalid) return;

    if (field.value.value !== field.originalValue) {
      const res = await application.updateProfileInfo({ [key]: field.value.value });
      if (!(res instanceof AppError)) {
        field.originalValue = field.value.value;
      }
    }

    field.isEditing.value = false;
    validation.$reset();
  }
</script>
<style scoped lang="scss">
  .page-profile {
    &__title {
      text-align: center;
    }
    &__info {
      background-color: rgba(0, 0, 0, 0.8);
    }
    &__fields {
      display: flex;
      justify-content: center;
    }
    &__fields-item {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    &__fields-actions {
      display: flex;
      gap: 0.25rem;
      min-width: 100px;
    }
  }
</style>
