import {computed} from 'vue'

/**
 * Creates a computed property with a getter and setter that use vue v-model binding.
 * @param props
 * @param emit
 * @param name
 */
export function useModelWrapper(props: any, emit: any, name = 'modelValue') {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value)
  })
}
