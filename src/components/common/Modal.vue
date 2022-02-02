<template>
  <teleport to="#modal">
    <div v-if="open" class="fixed inset-0 bg-white">
      <IconClose class="icon absolute m-6" @click="open = false" />
      <div class="flex flex-col w-full h-full justify-center">
        <div class="flex flex-row justify-center">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '/@/lib/modelWrapper'
import {IconClose} from '/@/components/icons'

export default defineComponent({
  components: {IconClose},
  props: {
    modelValue: Boolean,
  },
  emits: {
    'update:modelValue': () => true,
  },
  setup(props, {emit}) {
    return {
      open: useModelWrapper(props, emit)
    }
  }
})
</script>
