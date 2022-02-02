<template>
  <label v-if="label" class="text-sm text-gray-500">{{ label }}</label>
  <ButtonDropdown class="button bg-white" v-bind="$attrs">
    <template #button>
      {{ buttonLabel }}
    </template>
    <template #menu>
      <ul class="dropdown-list">
        <li v-if="emptyOption" @click="toggleValue(null)">&nbsp;</li>
        <li v-for="o in options" :key="o[0]" @click="toggleValue(o[0])">
          {{ o[1] }}
        </li>
      </ul>
    </template>
  </ButtonDropdown>
</template>
<script lang="ts">
import {computed, defineComponent, PropType, watch} from 'vue'
import ButtonDropdown from "/@/components/common/ButtonDropdown.vue";

export default defineComponent({
  name: 'TSelect',
  components: {ButtonDropdown},
  props: {
    label: {type: String, required: false},
    emptyOption: {type: Boolean, default: () => true},
    multi: {type: Boolean, default: () => false},
    modelValue: {},
    options: {type: Array as PropType<[any, string][]>}
  },
  emits: ['update:modelValue', 'change'],
  setup(props, {emit}) {
    const buttonLabel = computed(() => {
      const options = Array.isArray(props.modelValue)
        ? props.options?.filter((o) => (props.modelValue as string[]).includes(o[0]))
        : props.options?.filter((o) => o[0] === props.modelValue);
        return (options || []).map((o) => o[1]).join(', ')
    })
    watch(() => props.multi, (multi) => {
      const isArray = Array.isArray(props.modelValue)
      if (multi && !isArray) {
        emit('update:modelValue', [props.modelValue])
      } else if (!multi && isArray) {
        emit('update:modelValue', props.modelValue[0])
      }
    })
    function toggleValue(value: string) {
      let currentValue = props.modelValue
      let newValue: any = value
      if (props.multi) {
        const currentValue = (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) as string[]
        if (currentValue.includes(value)) {
          newValue = currentValue.filter((v) => (v !== value) && !!v)
        } else {
          newValue = currentValue.concat(value).filter((v) => !!v)
        }
      }
      emit('update:modelValue', newValue)
      if (newValue != currentValue) {
        emit('change', newValue)
      }

    }
    return { buttonLabel, toggleValue }
  }
})
</script>
