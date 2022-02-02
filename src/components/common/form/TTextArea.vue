<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="key" class="text-sm text-gray-500">{{ label }}</label>
    <textarea
      class="border rounded p-2"
      :class="error ? 'border-red-700' : 'border-gray-300'"
      :id="key"
      v-model="value"
      :placeholder="placeholder"
      v-bind="$attrs"
      :disabled="disabled"
    />
    <div v-if="error" class="text-red-700 text-right">
      {{ error }}
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '/@/lib/modelWrapper'
import {uniqid} from "/@/lib/helpers";

export default defineComponent({
  props: {
    key: {type: String, default: () => uniqid()},
    modelValue: {},
    label: String,
    error: String,
    placeholder: String,
    type: {type: String, default: 'string'},
    disabled: Boolean,
  },
  setup(props, {emit}) {
    const value = useModelWrapper(props, emit)
    return { value }
  },
})
</script>
