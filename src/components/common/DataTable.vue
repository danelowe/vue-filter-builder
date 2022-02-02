<template>
  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <table class="table-auto min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="heading in headings" :key="heading.key" class="px-6 py-3 text-left text-xs font-medium, text-gray-500 uppercase tracking-wider">
            {{ heading.label }}
          </th>
        </tr>
      </thead>
      <tr v-if="filterConfig && filter" class="bg-gray-50">
        <th v-for="heading in headings" :key="heading.key" class="px-6 py-3 text-left text-xs font-medium, text-gray-500 uppercase tracking-wider">
          <FilterTableAttribute :config="filterConfig" :filter="filter" :code="heading.key" @update:filter="$emit('update:filter', $event)" @submit:filter="$emit('submit:filter')" v-if="heading.key in filterConfig"/>
        </th>
      </tr>
      <tbody class="bg-white divide-y divide-gray-200">
        <template v-if="loading">
          <tr v-for="i in [...Array(loadingRowCount).keys()]" :key="i">
            <td v-for="heading in headings" v-bind="heading.rowProps || {}" :key="heading.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span class="skeleton-box h-5 w-24 inline-block" />
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="row in rows" :key="row.id" class="data-table-row">
            <td v-for="heading in headings" v-bind="heading.rowProps || {}" :key="heading.key" class="px-6 py-4 text-sm text-gray-900" @click="$emit('click:row', row)">
              <slot :name="'cell.'+heading.key" v-bind="cellComponentProps(row, heading)">
                <component :is="cellComponent(heading)" v-if="cellComponent(heading)" v-bind="cellComponentProps(row, heading)"/>
                <template v-else>
                  {{ getValue(row, heading) }}
                </template>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import {Component, defineComponent, PropType} from 'vue'
import DateCell from '/@/components/common/datatable/DateCell.vue'
import FilterAttribute from '/@/components/filter/FilterAttribute.vue'
import {BaseGroupFilter, FilterConfig} from '/@/lib/filters'
import FilterTableAttribute from '/@/components/filter/FilterTableAttribute.vue'

export interface Heading {
  label: string
  key: string
  component?: Component
  rowProps?: Record<string, unknown>
  cellComponentProps?: Record<string, unknown>
  width?: number
  type?: 'date'
}

export default defineComponent({
  components: {FilterTableAttribute, FilterAttribute},
  props: {
    headings: {
      type: Array as PropType<Heading[]>,
      required: true,
    },
    rows: {
      type: Array as PropType<Record<string, unknown>[]>,
      default: () => []
    },
    loading: { type: Boolean, default: false },
    subheading: { type: Boolean, default: false },
    loadingRowCount: { type: Number, default: 20 },
    filterConfig: { required: false, type: Object as PropType<FilterConfig|null>, default: () => null },
    filter: { type: Object as PropType<BaseGroupFilter|null>, default: () => null },
  },
  emits: ['update:filter', 'click:row', 'submit:filter'],
  setup(){
    function cellComponentProps(row: Record<string, unknown>, heading: Heading) {
      return Object.assign({value: getValue(row, heading), row: row}, heading.cellComponentProps)
    }

    function getValue(row: Record<string, unknown>, heading: Heading) {
      return row[heading.key]
    }

    function cellComponent(heading: Heading) {
      if (heading.component) {
        return heading.component
      } else if (heading.type) {
        return {
          date: DateCell
        }[heading.type]
      }
    }

    return {getValue, cellComponent, cellComponentProps}
  },
})
</script>

<style>
.data-table-row {
  cursor: pointer;
}

tbody tr:hover {
  background-color: #d3d3d3d3;
}
</style>
