<template>
  <label v-if="label" class="text-sm text-gray-500">{{ label }}</label>
  <div class="rating-stars" v-bind="$attrs">
    <svg
      v-for="star in stars"
      :key="star.value"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      @click="emit('update:modelValue', star.value)"
    >
      <path
        v-if="star.filled < 1"
        d="M480 207H308.6L256 47.9 203.4 207H32l140.2 97.9L117.6 464 256 365.4 394.4 464l-54.7-159.1L480 207z"
      />
      <path
        v-if="star.filled < 1 && star.filled > 0"
        clip-path="url(#clipstar)"
        d="M480 207H308.6L256 47.9 203.4 207H32l140.2 97.9L117.6 464 256 365.4 394.4 464l-54.7-159.1L480 207z"
        class="filled"
      />
      <path
        v-if="star.filled >= 1"
        d="M480 207H308.6L256 47.9 203.4 207H32l140.2 97.9L117.6 464 256 365.4 394.4 464l-54.7-159.1L480 207z"
        class="filled"
      />
      <defs v-if="star.filled < 1 && star.filled > 0">
        <clipPath id="clipstar">
          <rect :width="star.filled * 512" height="512" x="0" y="0" />
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref } from 'vue'
import {range} from "/@/lib/helpers";

interface Star {
  value: number
  filled: number
}

export default defineComponent({
  props: {
    label: {type: String, required: false},
    modelValue: { type: Number, default: 0 },
    maxRating: { type: Number, default: 5 },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const stars: Ref<Star[]> = computed(() => {
      const roundedValue = Math.round(props.modelValue * 4) / 4
      return range(1, props.maxRating).map(i => {
        const filled = Math.max(Math.min(roundedValue + 1 - i, 1), 0)
        return { value: i, filled: filled }
      })
    })

    return { stars, emit }
  },
})
</script>

<style>
.rating-stars {
  display: flex;
  position: relative;
  height: 20px;
  & svg {
    width: 20px;
    height: 20px;
    padding: 0;
    float: left;
    fill: #e0e0e0;

    & .filled {
      fill: #ffd201;
    }
  }
}
</style>
