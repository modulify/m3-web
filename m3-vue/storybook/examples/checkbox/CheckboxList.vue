<template>
    <div class="m3-panel m3-panel_elevated-1">
        <template v-for="(o, i) in options" :key="id + '-option-' + i">
            <template v-if="'subordinates' in o">
                <div :class="$style['line']">
                    <M3Checkbox
                        :id="id + '-option-' + i"
                        :model="isSelected(o)"
                        :indeterminate="isIndeterminate(o)"
                        @change="(checked: boolean) => toggle(o, checked)"
                    />

                    <label :for="id + '-option-' + i">
                        {{ o.label }}
                    </label>
                </div>

                <div style="padding-left: 32px">
                    <div
                        v-for="(s, j) in o.subordinates"
                        :key="id + '-option-' + i + '-' + j"
                        :class="$style['line']"
                    >
                        <M3Checkbox
                            :id="id + '-option-' + i + '-' + j"
                            v-model:model="model"
                            :value="s.value"
                        />

                        <label :for="id + '-option-' + i + '-' + j">
                            {{ s.label }}
                        </label>
                    </div>
                </div>
            </template>

            <div
                v-else
                :class="$style['line']"
            >
                <M3Checkbox
                    :id="id + '-option-' + i"
                    v-model:model="model"
                    :value="o.value"
                />

                <label :for="id + '-option-' + i">
                    {{ o.label }}
                </label>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import { M3Checkbox } from '@/components/checkbox'

import { ref } from 'vue'
import makeId from '@/utils/id'

interface Option {
  label: string;
  value: string;
}

interface OptionWithSubordinates extends Option {
  subordinates?: Option[],
}

defineProps({
  options: {
    type: Array as PropType<OptionWithSubordinates[]>,
    default: () => [],
  },
})

const id = makeId('m3-checkbox-example')

const model = ref<string[]>([])

const isSelected = (option: Required<OptionWithSubordinates>) => {
  return option.subordinates.every(o => model.value.includes(o.value))
}

const isIndeterminate = (option: Required<OptionWithSubordinates>) => {
  return option.subordinates.some(o => model.value.includes(o.value)) && !isSelected(option)
}

const toggle = (option: Required<OptionWithSubordinates>, checked: boolean) => {
  const values = (option.subordinates ?? []).map(o => o.value)

  if (checked) {
    model.value.push(...values.filter(v => !model.value.includes(v)))
  } else {
    model.value = model.value.filter(v => !values.includes(v))
  }
}
</script>

<style module>
.line {
    display: flex;
    align-items: center;
}
</style>