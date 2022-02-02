<template>
  <label v-if="label" :for="key" class="text-sm text-gray-500 mb-1">{{ label }}</label>
  <div
    class="flex-1 border p-1 rounded relative flex flex-row border-gray-300"
    :class="focused ? 'typeahead__focused' : ''"
    @click="input.focus()"
  >
    <div v-for="s in selected" class="bg-gray-200 px-2 rounded mr-1">
      <span class="text-gray-400">{{ s.sku }}</span> {{ s.name }}
    </div>
    <input
      @focus="focused = true"
      @blur="focused = false; results = []; query = '';"
      style="outline: none"
      ref="input"
      :id="key"
      v-model="query"
      @keyup="keyup"
      type="text"
      v-bind="$attrs"
      :class="error ? 'border-red-700' : 'border-gray-300'"
      :disabled="disabled"
    />
    <ul v-if="results.length > 0" class="absolute top-9 left-0 rounded shadow bg-white border border-gray-200 overflow-hidden">
      <li v-for="(r, i) in results" @mousedown="select(r); $event.stopPropagation(); input.focus()" class="p-2" :class="i === highlightedIndex ? 'bg-purple-700 text-white' : ''">
        {{ r.name }}
      </li>
    </ul>
  </div>
  <div v-if="error" class="text-red-700 text-right">{{ error }}</div>
</template>
<script lang="ts">
import {defineComponent, PropType, ref, watch} from "vue";
import {CatalogService} from "/@/api";
import {uniqid} from "/@/lib/helpers";

export type TypeAheadResult = {id?: number, name?: string}

export default defineComponent({
  props: {
    maxItems: {type: Number, default: () => 1},
    key: {type: String, default: () => uniqid()},
    label: {type: String, required: false},
    error: {type: String, required: false},
    disabled: {type: Boolean, required: false},
    modelValue: {type: Object as PropType<TypeAheadResult[]>, default: () => []}
  },
  emits: ['update:modelValue'],
  setup: function (props, {emit}) {
    const query = ref('')
    const selected = ref<TypeAheadResult[]>(props.modelValue)
    const results = ref<TypeAheadResult[]>([])
    const highlightedIndex = ref(-1)
    const input = ref(null)
    const focused = ref(false)

    watch(() => query.value, async () => {
      if (query.value.length >= 3) {
        results.value = await CatalogService.typeaheadProducts({query: query.value})
      }
    })

    function keyup(e: KeyboardEvent) {
      if (e.code === "ArrowUp") {
        const i = highlightedIndex.value - 1
        highlightedIndex.value = i < -1 ? -1 : i
      } else if (e.code === "ArrowDown") {
        const i = highlightedIndex.value + 1
        highlightedIndex.value = i >= results.value.length ? results.value.length - 1 : i
      } else if (e.code === "Enter") {
        select(results.value[highlightedIndex.value])
      }
    }

    function select(result: TypeAheadResult) {
      const s = selected.value.concat(result)
      selected.value = s.slice(s.length - props.maxItems)
      results.value = []
      query.value = ''
      emit('update:modelValue', selected.value)
    }

    return {query, selected, results, select, keyup, highlightedIndex, input, focused}
  }
})
</script>
<style lang="postcss">
.typeahead__focused:before {
  content: ' ';
  position: absolute;
  left: -3px;
  right: -3px;
  top: -3px;
  bottom: -3px;
  border-radius: 0.375rem;
  @apply border-2 border-purple-700;
}
</style>
