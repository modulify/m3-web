<script lang="ts">
import type { PropType } from 'vue'
import type { Code } from './codes'

import {
  defineComponent,
  h,
  useAttrs,
  useCssModule,
} from 'vue'

import provider from './CountryFlagProvider'

export default defineComponent({
  props: {
    code: {
      type: String as PropType<Code>,
      validator: (code: string) => provider.has(code as Code),
      required: true,
    },
  },

  setup (props) {
    const $attrs = useAttrs()
    const $style = useCssModule()

    return () => h(provider.get(props.code), {
      ...$attrs,
      class: [$attrs.class, $style['flag']],
    })
  },
})
</script>

<style lang="scss" module>
.flag {
  border-radius: 50%;
}
</style>