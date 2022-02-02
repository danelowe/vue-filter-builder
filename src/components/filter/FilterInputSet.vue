<template>
  <FilterInput :value="fromValue" :multi="isMultiOperator(filter.operator)" :config="config" v-bind="$attrs" @update:value="emitValue('from', $event)" @submit:filter="$emit('submit:filter')"/>
  <span v-if="range" class="px-1" style="line-height:1.75rem;">And</span>
  <FilterInput v-if="range" :value="toValue" :multi="false" :config="config" v-bind="$attrs" @update:value="emitValue('to', $event)" @submit:filter="$emit('submit:filter')"/>
</template>
<script lang="ts">
import {computed, defineComponent, PropType, watch} from 'vue'
import DateTimeField from '/@/components/common/form/DateTimeField.vue'
import {AttributeFilter, FilterAttributeConfig, isMultiOperator} from '/@/lib/filters'
import TSelect from "/@/components/common/form/TSelect.vue"
import DateField from "/@/components/common/form/DateField.vue";
import FilterInput from "/@/components/filter/FilterInput.vue";

/**
 * Component to render either one or two inputs for the filter value,
 * depending on whether the filter operator allows multiple values e.g. _between_
 */
export default defineComponent({
  components: {FilterInput, DateField, TSelect, DateTimeField},
  props: {
    filter: {required: true, type: Object as PropType<AttributeFilter<any>>},
    config: {required: true, type: Object as PropType<FilterAttributeConfig>},
    range: {required: true, type: Boolean},
  },
  emits: ['update:filter', 'submit:filter'],
  setup(props, { emit }) {
    const fromValue = computed(() => Array.isArray(props.filter.value) ? props.filter.value[0] : props.filter.value)
    const toValue = computed(() => Array.isArray(props.filter.value) ? props.filter.value[1] : null)
    function emitValue(location: 'from'|'to'|null, value: any | null) {
      if (props.range && (location === 'from')) {
        emitFilter([value, toValue.value])
      } else if (props.range && (location === 'to')) {
        emitFilter([fromValue.value, value])
      } else {
        emitFilter(value)
      }
    }
    function emitFilter(value: any) {
      emit('update:filter', Object.assign({}, props.filter, {value}))
    }
    watch(() => props.range, (range) => {
      const isArray = Array.isArray(props.filter.value)
      if (range && !isArray) {
        emitFilter([props.filter.value, null])
      } else if (!range && isArray) {
        emitFilter(props.filter.value[0])
      }
    })
    return {emitValue, isMultiOperator, fromValue, toValue}
  }
})
</script>
