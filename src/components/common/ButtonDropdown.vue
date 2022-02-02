<template>
  <div>
    <button type="button" v-bind="$attrs" @mousedown="mouseDown" @mouseup="mouseUp">
      <slot name="button" />
    </button>
    <div ref="menu" tabindex="-1" class="focus:outline-none" @focus="showMenu = true" @focusout="showMenu = false"
         @click="blur"
    >
      <div v-if="showMenu" class="fixed bg-white shadow-md z-10">
        <slot name="menu" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  inheritAttrs: false,
  data() {
    return {
      showMenu: false,
      wasFocused: false,
    }
  },
  methods: {
    mouseDown() {
      const menu = this.$refs.menu
      this.wasFocused = (menu === document.activeElement)
    },
    mouseUp() {
      if (!this.wasFocused && this.$refs.menu) {
        (this.$refs.menu as HTMLDivElement).focus()
      }
    },
    blur() {
      if (this.$refs.menu) {
        (this.$refs.menu as HTMLDivElement).blur()
      }
    }
  }
})

</script>
