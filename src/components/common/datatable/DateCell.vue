<template>
  <span>{{ formatDate(value) }}</span>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {formatDate} from '/@/lib/helpers'

export default defineComponent({
  props: {
    value: String as PropType<string>,
    row: Object as PropType<object>,
    states: Object as PropType<{ [key: string]: { label: string } }>
  },
  setup() {
    return {formatDate}
  }
})
</script>
