<template>
  <input v-model="dateStr" type="date" v-bind="$attrs">
  &nbsp;
  <select v-model="hourStr" class="bg-white button">
    <option v-for="h in hours">{{ h }}</option>
  </select>
  <span style="line-height:1.75rem">:</span>
  <select v-model="minutesStr" class="bg-white button">
    <option v-for="m in minutes">{{ m }}</option>
  </select>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: {
    // time in epoch (UTC seconds)
    modelValue: {type: Number, default: () => 0}
  },
  emits: ['update:modelValue'],
  setup() {
    return {
      hours: Array.from({length: 24}, (value, key) => key < 10 ? '0' + key : '' + key),
      minutes: Array.from({length: 60}, (value, key) => key < 10 ? '0' + key : '' + key),
    }
  },
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
        this.$emit('update:modelValue', Math.round(dt.getTime() / 1000))
      }
    },
    hourStr: {
      get(): string {
        // Return hours string in user's timezone
        if (this.datetime) {
          const h = this.datetime.getHours()
          return h < 10 ? '0' + h : '' + h
        }
        return ''
      },
      set(newValue: string) {
        // Set hours in user's timezone
        const dt = this.datetime ? new Date(this.datetime.getTime()) : new Date()
        dt.setHours(parseInt(newValue, 10))
        this.$emit('update:modelValue', Math.round(dt.getTime() / 1000))
      }
    },
    minutesStr: {
      get(): string {
        // Return minutes string in user's timezone
        if (this.datetime) {
          const m = this.datetime.getMinutes()
          return m < 10 ? '0' + m : '' + m
        }
        return ''
      },
      set(newValue: string) {
        // Set minutes in user's timezone
        const dt = this.datetime ? new Date(this.datetime.getTime()) : new Date()
        dt.setMinutes(parseInt(newValue, 10))
        this.$emit('update:modelValue', Math.round(dt.getTime() / 1000))
      }
    },
  }

})
</script>
