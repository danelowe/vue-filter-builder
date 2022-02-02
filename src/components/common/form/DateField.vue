<template>
  <input v-model="dateStr" type="date" v-bind="$attrs"/>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: {
    // time in epoch (UTC seconds)
    modelValue: {type: Number, default: () => 0}
  },
  emits: ['update:modelValue'],
  computed: {
    datetime(): Date | null {
      // Create a date (in user's timezone) from an epoch (in UTC seconds)
      if (this.modelValue) {
        var d = new Date(0)
        d.setUTCSeconds(this.modelValue)
        return d
      }
      return null
    },
    dateStr: {
      get(): string {
        // Return date string in user's time zone
        const dt = this.datetime
        if (dt) {
          const m = dt.getMonth() + 1
          const mm = m < 10 ? '0' + m : m
          const d = dt.getDate()
          const dd = d < 10 ? '0' + d : d
          return `${dt.getFullYear()}-${mm}-${dd}`
        }
        return ''
      },
      set(newValue: string) {
        // Set date string in user's timezone
        const dt = this.datetime ? new Date(this.datetime.getTime()) : new Date()
        const [yyyy, mm, dd] = newValue.split('-')
        dt.setFullYear(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10))
        dt.setHours(0)
        dt.setMinutes(0)
        dt.setSeconds(0)
        dt.setMilliseconds(0)
        this.$emit('update:modelValue', Math.round(dt.getTime() / 1000))
      }
    }
  }

})
</script>
