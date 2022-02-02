<template>
  <div class="flex">
    <FilterOperatorChooser
      class="bg-white border-2 border-gray-300"
      :operators="attributeConfig.operators"
      :filter="attributeFilter"
      @update:filter="attributeFilter = $event; $emit('submit:filter')"
    />
    <FilterInputSet
      :range="attributeFilter.operator === '><'"
      :filter="attributeFilter"
      :config="attributeConfig"
      class="flex-grow w-full rounded px-1  border-gray-300 border-2"
      @update:filter="attributeFilter = $event"
      @submit:filter="$emit('submit:filter')"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import {
  AttributeFilter,
  BaseGroupFilter,
  FilterAttributeConfig,
  FilterConfig,
} from '/@/lib/filters'
import FilterOperatorChooser from '/@/components/filter/FilterOperatorChooser.vue'
import FilterInputSet from "/@/components/filter/FilterInputSet.vue";
import {useFilters} from "/@/lib/useFilters";

export default defineComponent({
  components: { FilterOperatorChooser, FilterInputSet },
  props: {
    filter: { required: true, type: Object as PropType<BaseGroupFilter> },
    config: { required: true, type: Object as PropType<FilterConfig> },
    code: { required: true, type: String },
  },
  emits: ['update:filter', 'submit:filter', 'remove'],
  setup(props, { emit }) {
    const filterOpts = useFilters(props, emit)
    const attributeConfig = computed(() => props.config[props.code] || {})
    const chosenOperator = ref(
      (props.config[props.code] as FilterAttributeConfig).operators[0]
    )
    const attributeFilter = computed<AttributeFilter>({
      get: () => {
        chosenOperator.value
        if (props.filter.combinationType === 'all') {
          return (props.filter.children.find(
            (c: any) => c.type === 'attribute' && c.attribute === props.code
          ) ||
            filterOpts.createFilter(props.code, chosenOperator.value)) as AttributeFilter
        }
        return filterOpts.createFilter(
          props.code,
          chosenOperator.value
        ) as AttributeFilter
      },
      set: (filter: AttributeFilter) => {
        chosenOperator.value = filter.operator
        if (props.filter.combinationType === 'all') {
          const i = props.filter.children.findIndex(
            (c: any) => c.type === 'attribute' && c.attribute === props.code
          )
          const present = filter.value || (filter.value === false)
          return i >= 0
            ? present
              ? filterOpts.updateChild(i, filter)
              : filterOpts.removeChild(i)
            : present
            ? filterOpts.addChild(filter)
            : null
        } else if (filter.value) {
          emit('update:filter', { combinationType: 'all', children: [filter] })
        }
      },
    })
    return { attributeConfig, attributeFilter, ...filterOpts }
  },
})
</script>
