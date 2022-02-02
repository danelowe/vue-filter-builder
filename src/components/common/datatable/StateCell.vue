<template>
  <span :class="value">{{ (states[value.toLowerCase()] || {label: value}).label }}</span>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'

export default defineComponent({
  props: {
    value: String as PropType<string>,
    row: Object as PropType<object>,
    states: Object as PropType<{ [key: string]: { label: string } }>
  }
})
</script>
