/*
Filter Group should be based on the linked example.

Especially the sync between header filters and advanced filters

We should also be able to quickly save a filter as a preset and use it in filters

https://community.devexpress.com/blogs/javascript/archive/2018/04/25/devextreme-datagrid-and-treelist-integrated-filter-builder-v18-1.aspx
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/FilterPanel/Vue/MaterialTealDark/
*/
<template>
  <div class="flex mt-2 ml-4">
    <button v-if="isChild" type="button" class="h-8" @click="$emit('remove')">
      <IconPlus class="w-5 transform rotate-45 fill-current text-red-700" />
      <span class="sr-only">Remove</span>
    </button>
    <div>
      <div class="flex items-start">
        <FilterChooser :label="filterLabel" type="group" :options="isChild ? filterOptions : groupOptions"
                       @change="changeFilter"
        />
        <button type="button" alt="Add" @click="addDefaultChild()">
          <IconPlus class="w-5 fill-current text-green-700" />
          <span class="sr-only">Add</span>
        </button>
      </div>
      <template v-for="(child, i) in filter.children">
        <FilterPreset v-if="child.type === 'preset'" :key="i" :config="config"
                      :filter="child" @update:filter="updateChild(i, $event)" @remove="removeChild(i)"
        />
        <FilterAttribute v-if="child.type === 'attribute'" :key="i" :config="config"
                         :filter="child" @update:filter="updateChild(i, $event)" @remove="removeChild(i)"
        />
        <filter-group v-if="child.type === 'group'" :id="id+'_'+i" :key="i" :is-child="true" :config="config"
                      :filter="child" @update:filter="updateChild(i, $event)" @remove="removeChild(i)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import {BaseGroupFilter, DefaultFilter, FilterConfig} from '/@/lib/filters'
import FilterAttribute from '/@/components/filter/FilterAttribute.vue'
import FilterPreset from '/@/components/filter/FilterPreset.vue'
import FilterChooser from '/@/components/filter/FilterChooser.vue'
import {IconPlus} from '/@/components/icons'
import {useFilters} from "/@/lib/useFilters";

export default defineComponent({
  name: 'FilterGroup',
  components: {FilterChooser, FilterAttribute, FilterPreset, IconPlus},
  props: {
    id: {
      type: String,
      default: 'filter-group'
    },
    config: {
      required: true,
      type: Object as PropType<FilterConfig>
    },
    filter: {
      type: Object as PropType<BaseGroupFilter>,
      default: () => DefaultFilter
    },
    isChild: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['update:filter', 'remove'],
  setup(props, {emit}) {
    const filterOpts = useFilters(props, emit)
    const filterLabel = computed(() => (props.filter.combinationType === 'all') ? 'All Of' : 'Any Of')
    return { filterLabel, ...filterOpts }
  },
})
</script>
