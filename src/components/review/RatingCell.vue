<template>
  <div>
    <RatingStars :modelValue="value"/>
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import RatingStars from "/@/components/review/RatingStars.vue";

export default defineComponent({
  components: {RatingStars},
  props: {
    value: Number as PropType<number>,
    row: Object as PropType<object>,
  }
})
</script>
