<template>
  <div
    class="border border-gray-300 rounded p-4 flex flex-col place-items-center cursor-pointer"
    :class="launcherClasses"
    @click="$refs.input.click()"
    @dragover="drag($event, true)"
    @dragenter="drag($event, true)"
    @dragleave="drag($event, false)"
    @dragover.prevent
    @drop="drop"
  >
    <div class="flex">
      <IconCloudUpload style="width: 30px" class="inline-block mr-3"/>
      <span class="uppercase" style="line-height: 20px;">{{ label }}</span>
    </div>
    <span class="block text-gray-400">{{ hint }}</span>
  </div>
  <input
    ref="input"
    class="hidden"
    type="file"
    multiple="multiple"
    @change="change"
  />
  <span v-if="errorText" class="text-red-700">{{ errorText }}</span>
  <div v-if="uploads.length > 0" class="flex gap-2 my-4">
    <div v-for="upload in uploads" :key="upload" class="w-36">
      <img :src="getFileUrl(upload)"/>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import {IconCloudUpload} from "/@/components/icons";

export default defineComponent({
  name: 'ImageUploader',
  components: {IconCloudUpload},
  props: {
    modelValue: {type: Array, default: () => []},
    label: {type: String, default: 'Add Photos'},
    hint: {type: String, default: 'Max Upload 10MB'},
    maxSize: {type: Number, default: 20 * 1024 * 1024},
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    let uploads: File[] = []
    const imageUrl = ref('')
    const errorText = ref('')
    const dragging = ref(false)

    const launcherClasses = computed(() => {
      return {
        'image-uploader__launcher': true,
        'image-uploader__launcher--dragging': dragging.value,
      }
    })

    function drop(event: any) {
      drag(event, false)
      const files = event.dataTransfer.files
      if (files) {
        _addFiles(files)
      }
    }

    function drag(event: Event, value: boolean) {
      event.preventDefault()
      event.stopPropagation()
      dragging.value = value
    }

    function change(event: Event) {
      const files = (event.target as HTMLInputElement).files as FileList
      _addFiles(files)
    }

    function getFileUrl(file: File) {
      return URL.createObjectURL(file)
    }

    function _addFiles(files: FileList) {
      if (files.length > 0) {
        errorText.value = ''
        for (let i = 0; i < files.length; i++) {
          const imageFile = files.item(i)
          if (imageFile) {
            if (!imageFile.type.match('image.*')) {
              errorText.value = 'We cannot accept this type of file'
            } else if (imageFile.size > props.maxSize) {
              errorText.value = 'Your image is too large to upload'
            } else {
              uploads.push(imageFile)
              context.emit('update:modelValue', uploads)
            }
          }
        }
      }
    }

    return {
      uploads,
      dragging,
      imageUrl,
      errorText,
      launcherClasses,
      drag,
      drop,
      change,
      getFileUrl,
    }
  },
})
</script>

<style lang="postcss">
.image-uploader__launcher--dragging {
  border-width: 4px;
  margin: -3px;
}
</style>
