<template>
  <ButtonDropdown class="button">
    <template #button>
      <span class="uppercase" v-if="filter.operator === '><'">Between</span><span v-else>{{ filter.operator }}</span>
    </template>
    <template #menu>
      <ul class="dropdown-list">
        <li v-for="operator in operators" :key="operator" @click="emitValue(operator)">
          <span v-if="operator === '><'">Between</span><span v-else>{{ operator }}</span>
        </li>
      </ul>
    </template>
  </ButtonDropdown>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {AttributeFilter} from '../../lib/filters'
import ButtonDropdown from '/@/components/common/ButtonDropdown.vue'

export default defineComponent({
  components: {ButtonDropdown},
  props: {
    filter: {required: true, type: Object as PropType<AttributeFilter<any>>},
    operators: {required: true, type: Array as PropType<string[]>},
  },
  emits: ['update:filter'],
  setup(props, { emit }) {
    function emitValue(operator) {
      emit('update:filter', Object.assign({}, props.filter, {operator}))
    }

    return {emitValue}
  }
})
</script>
