<template>
    <M3Button
        appearance="tonal"
        @click="opened = true"
    >
        Delete
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
                Permanently delete?
            </h3>
        </template>

        <p id="dialog-confirmation-description">
            Deleting the selected messages will also remove them from all synced devices.
        </p>

        <template #footer>
            <M3Button
                appearance="text"
                @click="opened = false"
            >
                Cancel
            </M3Button>

            <M3Button
                appearance="tonal"
                @click="opened = false"
            >
                Delete
            </M3Button>
        </template>
    </M3Dialog>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'

import { ref } from 'vue'

const opened = ref(false)
</script>
