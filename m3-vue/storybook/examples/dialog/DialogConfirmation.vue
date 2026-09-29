<template>
    <M3Button
        appearance="tonal"
        @click="opened = true"
    >
        {{ text.delete }}
    </M3Button>

    <M3Dialog
        v-model:opened="opened"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-confirmation-title"
        aria-describedby="dialog-confirmation-description"
    >
        <template #icon>
            <M3Icon name="delete" appearance="outlined" />
        </template>

        <template #header>
            <h3 id="dialog-confirmation-title">
                {{ text.title }}
            </h3>
        </template>

        <p id="dialog-confirmation-description">
            {{ text.description }}
        </p>

        <template #footer>
            <M3Button
                appearance="text"
                @click="opened = false"
            >
                {{ text.cancel }}
            </M3Button>

            <M3Button
                appearance="tonal"
                @click="opened = false"
            >
                {{ text.delete }}
            </M3Button>
        </template>
    </M3Dialog>
</template>

<script lang="ts" setup>
import type { StorybookLocale } from '../../i18n'

import { computed, ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'

import { localize } from '../../i18n'

interface DialogConfirmationProps {
  locale: StorybookLocale;
}

const props = defineProps<DialogConfirmationProps>()

const messages = {
  'en-US': {
    cancel: 'Cancel',
    delete: 'Delete',
    description: 'Deleting the selected messages will also remove them from all synced devices.',
    title: 'Permanently delete?',
  },
  'ru-RU': {
    cancel: 'Отмена',
    delete: 'Удалить',
    description: 'Выбранные сообщения также будут удалены со всех синхронизированных устройств.',
    title: 'Удалить навсегда?',
  },
}

const opened = ref(false)
const text = computed(() => localize(props.locale, messages))
</script>
