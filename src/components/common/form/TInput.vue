<template>
  <div class="flex flex-col">
    <label v-if="label" :for="key" class="text-sm text-gray-500 mb-1">{{ label }}</label>
    <input
      :id="key"
      v-model="value"
      type="text"
      class="flex-1 border p-1 rounded"
      v-bind="$attrs"
      :class="error ? 'border-red-700' : 'border-gray-300'"
      :disabled="disabled"
    />
  </div>
  <div v-if="error" class="text-red-700 text-right">{{ error }}</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useModelWrapper } from '/@/lib/modelWrapper'
import {uniqid} from "/@/lib/helpers";

export default defineComponent({
  props: {
    key: {type: String, default: () => uniqid()},
    modelValue: {},
    label: String,
    error: String,
    type: { type: String, default: 'string' },
    disabled: Boolean,
  },
  setup(props, { emit }) {
    const value =
      props.type === 'datetime'
        ? new Date((props.modelValue as string) || '').toLocaleString()
        : useModelWrapper(props, emit)

    return {
      value,
    }
  },
})
</script>
