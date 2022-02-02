<template>
  <div class="flex mt-2 ml-4">
    <button type="button" class="h-8" @click="$emit('remove')">
      <IconPlus class="w-5 transform rotate-45 fill-current text-red-700" />
      <span class="sr-only">Remove</span>
    </button>
    <FilterChooser type="attribute" :label="filterLabel" :options="filterOptions" @change="changeFilter" />
    <FilterOperatorChooser :operators="attributeConfig.operators" :filter="filter" @update:filter="$emit('update:filter', $event)" class="bg-purple-700 text-white button" />
    <div>
      <FilterInputSet
        :range="filter.operator === '><'"
        :filter="filter"
        :config="attributeConfig"
        class="flex-grow w-full rounded px-1 border-2 h-8"
        @update:filter="$emit('update:filter', $event)"
        @submit:filter="$emit('submit:filter')"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {computed, defineComponent, PropType, ref} from 'vue'
import {
  AttributeFilter,
  FilterAttributeConfig,
  FilterConfig,
  filterValueAsString,
} from '/@/lib/filters'
import FilterChooser from '/@/components/filter/FilterChooser.vue'
import DateTimeField from '/@/components/common/form/DateTimeField.vue'
import {IconPlus} from '/@/components/icons'
import FilterOperatorChooser from '/@/components/filter/FilterOperatorChooser.vue'
import FilterInputSet from "/@/components/filter/FilterInputSet.vue";
import {useFilters} from "/@/lib/useFilters";

export default defineComponent({
  components: {FilterInputSet, FilterOperatorChooser, DateTimeField, FilterChooser, IconPlus},
  props: {
    filter: { required: true, type: Object as PropType<AttributeFilter<any>> },
    config: { required: true, type: Object as PropType<FilterConfig> }
  },
  emits: ['update:filter', 'remove'],
  setup(props, {emit}) {
    const filterOpts = useFilters(props, emit)
    const enteringValue = ref(false)
    const attributeConfig = computed(() => props.config[props.filter.attribute])
    const filterValueLabel = computed(() => props.filter.value
      ? filterValueAsString(props.filter, attributeConfig.value as FilterAttributeConfig)
      : '<enter a value>')
    const filterLabel = computed(() => props.config[props.filter.attribute].label)
    const inputContainer = ref<HTMLDivElement>(null)
    function blur(event: FocusEvent) {
      const div = inputContainer.value
      // if the blur was because of outside focus
      // currentTarget is the parent element, relatedTarget is the clicked element
      if (div && event.relatedTarget && div.contains(event.relatedTarget as HTMLElement)) {
        div.focus()
      } else {
        enteringValue.value = false
      }
    }
    return { enteringValue, attributeConfig, filterValueLabel, filterLabel, blur, ...filterOpts, inputContainer}
  }
})
</script>
