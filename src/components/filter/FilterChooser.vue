<template>
  <ButtonDropdown :class="'button '+filterClasses[type]">
    <template #button>
      {{ label }}
    </template>
    <template #menu>
      <ul class="dropdown-list">
        <li v-for="[_code, _label, _type] in options" :class="filterClasses[_type]" :test="_type"
            @click="$emit('change', _code)"
        >
          {{ _label }}
        </li>
      </ul>
    </template>
  </ButtonDropdown>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import ButtonDropdown from '../common/ButtonDropdown.vue'

export default defineComponent({
  components: {ButtonDropdown},
  props: {
    type: {
      type: String,
    },
    label: {
      type: String,
    },
    options: {
      type: Array,
    }
  },
  data: () => ({
    filterClasses: {
      group: 'bg-pink-700 text-white hover:bg-pink-800',
      preset: 'bg-blue-500 text-white hover:bg-blue-600',
      attribute: 'bg-green-500 text-white hover:bg-green-600'
    },
  })
})
</script>
