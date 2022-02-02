<template>
  <input v-if="['numeric', 'string'].indexOf(config.type) >= 0" :value="value" v-bind="$attrs" @input="emitValue($event.target.value)" @keydown="checkForEnter">
  <DateTimeField v-if="config.type === 'datetime'" :modelValue="value" v-bind="$attrs" @update:modelValue="emitValue" />
  <DateField v-if="config.type === 'date'" :modelValue="value" v-bind="$attrs" @update:modelValue="emitValue" @change="$emit('submit:filter')"/>
  <TSelect v-if="config.type === 'options'" :multi="multi" :modelValue="value" v-bind="$attrs" @update:modelValue="emitValue" :options="config.options" @change="$emit('submit:filter')"/>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import DateTimeField from '/@/components/common/form/DateTimeField.vue'
import {FilterAttributeConfig, isMultiOperator} from '/@/lib/filters'
import TSelect from "/@/components/common/form/TSelect.vue"
import DateField from "/@/components/common/form/DateField.vue";

export default defineComponent({
  components: {DateField, TSelect, DateTimeField},
  props: {
    value: {required: true},
    multi: {required: true, type: Boolean},
    config: {required: true, type: Object as PropType<FilterAttributeConfig>},
  },
  emits: ['submit:filter', 'update:value'],
  setup(props, { emit }) {
    function emitValue(value: any | null) {
      emit('update:value', value)
    }
    function checkForEnter(e: KeyboardEvent) {
      if (e.code.toUpperCase() == "ENTER") {
        emit('submit:filter')
      }
    }
    return {emitValue, isMultiOperator, checkForEnter}
  }
})
</script>
