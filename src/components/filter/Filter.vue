<template>
  <div class="flex mt-6 py-2 justify-between">
    <div class="flex text-purple-500 cursor-pointer" @click="filterModalOpen = !filterModalOpen">
      <button type="button">
        <IconFilterVariant style="width: 24px;" />
        <span class="sr-only">Filter</span>
      </button>
      <div class="py-1">{{ filterString }}</div>
    </div>
    <form @submit.prevent="$emit('submit:filter')" @click="$event.stopPropagation()" class="self-end">
      <button type="button" class="button bg-gray-500 text-white" @click="clearFilter">Clear</button>
      <button type="submit" class="button bg-purple-700 text-white">Search</button>
    </form>
    <modal v-model="filterModalOpen">
      <div class="flex flex-col">
        <FilterGroup v-if="config" v-model:filter="filterModelValue" :config="config" />
        <form @submit.prevent="$emit('submit:filter'); filterModalOpen = false;">
          <div class="text-center my-6">
            <button
              class="inline-block bg-purple-600 rounded py-2 px-4 text-white shadow-md"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from 'vue'
import {BaseGroupFilter, FilterConfig, filterAsString, DefaultFilter} from '../../lib/filters'
import FilterGroup from '/@/components/filter/FilterGroup.vue'
import {IconFilterVariant} from '/@/components/icons'
import {useModelWrapper} from '/@/lib/modelWrapper'

export default defineComponent({
  components: {FilterGroup, IconFilterVariant},
  props: {
    config: {
      type: Object as PropType<FilterConfig|null>,
      default: () => null,
    },
    filter: {
      type: Object as PropType<BaseGroupFilter>,
      default: () => DefaultFilter,
    },
  },
  emits: ['update:filter', 'submit:filter'],
  setup(props, {emit}) {
    const filterString = computed(() => props.config ? filterAsString(props.filter, props.config) : '')
    const filterModelValue = useModelWrapper(props, emit, 'filter')
    const filterModalOpen = ref(false)
    function clearFilter() {
      emit('update:filter', DefaultFilter)
      emit('submit:filter')
    }
    return {filterString, filterModelValue, filterModalOpen, clearFilter}
  }
})
</script>
