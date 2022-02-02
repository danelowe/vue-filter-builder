<template>
  <div class="flex mt-2 ml-4">
    <button type="button" class="h-8" @click="$emit('remove')">
      <IconPlus class="w-5 transform rotate-45 fill-current text-red-700" />
      <span class="sr-only">Remove</span>
    </button>
    <FilterChooser type="preset" :label="filterLabel" :options="filterOptions" @change="changeFilter" />
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {FilterConfig, FilterPresetConfig, PresetFilter} from '/@/lib/filters'
import FilterChooser from '/@/components/filter/FilterChooser.vue'
import {IconPlus} from '/@/components/icons'
import {useFilters} from "/@/lib/useFilters";

export default defineComponent({
  components: {FilterChooser, IconPlus},
  props: {
    filter: {
      required: true,
      type: Object as PropType<PresetFilter>
    },
    config: {
      required: true,
      type: Object as PropType<FilterConfig>
    }
  },
  emits: ['update:filter', 'remove'],
  setup(props, {emit}) {
    return {
      ...useFilters(props, emit)
    }
  },
  computed: {
    presetConfig(): FilterPresetConfig {
      return this.config[this.filter.name] as FilterPresetConfig
    },
    filterLabel(): string {
      return this.config[this.filter.name].label
    }
  }
})
</script>
