<template>
    <div>
        <M3Navigation v-if="scenario === 'navigation'" appearance="bar">
            <M3NavigationTab :label="text.inbox" active>
                <M3Icon name="inbox" />
            </M3NavigationTab>
            <M3NavigationTab :label="text.browse">
                <M3Icon name="explore" />
            </M3NavigationTab>
            <M3NavigationTab :label="text.library">
                <M3Icon name="library_music" />
            </M3NavigationTab>
        </M3Navigation>

        <main
            :class="{ 'm3-has-navigation_bar': scenario === 'navigation' }"
            :style="{ minHeight: scenario === 'navigation' ? '100vh' : '360px', padding: '32px', background: 'var(--m3-sys-surface)' }"
        >
            <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }">
                <M3Button v-if="scenario === 'feedback' || scenario === 'navigation'" @click="showFeedback">
                    {{ text.feedback }}
                </M3Button>
                <M3Button v-if="scenario === 'undo'" @click="showUndo">
                    {{ text.archive }}
                </M3Button>
                <template v-if="scenario === 'queue'">
                    <M3Button @click="showQueue">
                        {{ text.queue }}
                    </M3Button>
                    <M3Button appearance="outlined" @click="replace">
                        {{ text.replace }}
                    </M3Button>
                </template>
                <span v-if="feedback" role="status">{{ feedback }}</span>
            </div>

            <M3SnackbarHost
                ref="host"
                :render-action="scenario === 'undo' ? renderUndoAction : undefined"
                :style="scenario === 'navigation' ? { '--m3-snackbar-inset-block-end': 'calc(64px + 96px)' } : undefined"
            />

            <M3FabButton
                v-if="scenario === 'navigation'"
                :style="{ position: 'fixed', insetInlineEnd: '24px', insetBlockEnd: 'calc(64px + 16px)' }"
                variant="tertiary"
            >
                <M3Icon name="edit" />{{ text.compose }}
            </M3FabButton>
        </main>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { SnackbarActionRenderer, SnackbarHostMethods } from '@/components/snackbar'

import { computed, h, ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3SnackbarHost } from '@/components/snackbar'

import { localize } from '../../i18n'

const FEEDBACK_DURATION_MS = 6000
const QUEUED_UPDATE_DURATION_MS = 4000

const messages = {
  'en-US': {
    feedback: 'Save changes',
    saved: 'Saved',
    savedMessage: 'Changes saved',

    archive: 'Archive email',
    archived: 'Email archived',
    action: 'Undo',
    close: 'Close notification',

    queue: 'Queue two updates',
    replace: 'Replace with latest update',
    first: 'Uploading photo',
    second: 'Photo uploaded',

    inbox: 'Inbox',
    browse: 'Browse',
    library: 'Library',
    compose: 'Compose',
  },

  'ru-RU': {
    feedback: 'Сохранить изменения',
    saved: 'Сохранено',
    savedMessage: 'Изменения сохранены',

    archive: 'Архивировать письмо',
    archived: 'Письмо архивировано',
    action: 'Отменить',
    close: 'Закрыть уведомление',

    queue: 'Поставить два сообщения в очередь',
    replace: 'Заменить новым сообщением',
    first: 'Загружаем фото',
    second: 'Фото загружено',

    inbox: 'Входящие',
    browse: 'Обзор',
    library: 'Библиотека',
    compose: 'Создать',
  },
}

const props = defineProps({
  scenario: {
    type: String as PropType<'feedback' | 'undo' | 'queue' | 'navigation'>,
    required: true,
  },

  locale: {
    type: String,
    default: 'en-US',
  },
})

const host = ref<SnackbarHostMethods | null>(null)
const feedback = ref('')
const text = computed(() => localize(props.locale, messages))
const renderUndoAction: SnackbarActionRenderer = ({ buttonProps }) => h(M3Button, buttonProps, () => text.value.action)

const showFeedback = () => {
  feedback.value = text.value.saved
  void host.value?.show({ message: text.value.savedMessage, duration: FEEDBACK_DURATION_MS, closeLabel: text.value.close })
}

const showUndo = () => {
  feedback.value = text.value.archived
  void host.value?.show({ message: text.value.archived, closeLabel: text.value.close })
    .then(result => {
      if (result === 'action') feedback.value = ''
    })
}

const showQueue = () => {
  void host.value?.show({ message: text.value.first, duration: QUEUED_UPDATE_DURATION_MS, closeLabel: text.value.close })
  void host.value?.show({ message: text.value.second, duration: QUEUED_UPDATE_DURATION_MS, closeLabel: text.value.close })
}

const replace = () => {
  void host.value?.replace({ message: text.value.second, duration: QUEUED_UPDATE_DURATION_MS, closeLabel: text.value.close })
}
</script>
