import {Ref, ref, watch} from 'vue'
import {
  baseFilterAndInterimConfigFromUrlParam,
  BaseGroupFilter, convertToBackendFilter,
  filterAsString,
  filterAsUrlParam, parseFilterConfigFromBackend,
} from '/@/lib/filters'
import {useRoute, useRouter} from 'vue-router'

interface FetchOptions {
  cursor?: string
  perPage?: number
  prevCursor?: string
  query?: string
}

/**
 * Create refs that contain results and filterData, and a method to submit a filter.
 *
 * Manages the communication with backend. Submitting a filter should retrieve more backend data.
 * @param fetch
 */
export function useResults<T>(fetch: (options: FetchOptions) => Promise<T>): { results: Ref<T | undefined>, filterData: Ref<BaseGroupFilter>, submitFilter: (e: Event) => void } {
  const results = ref<T>()
  const route = useRoute()
  const filterAndInterimConfig = baseFilterAndInterimConfigFromUrlParam(route.query.filter?.toString() || '')
  const filterData = ref(filterAndInterimConfig.filter)
  const interimConfig = filterAndInterimConfig.config
  const router = useRouter()

  watch(
    () => route.params.filter,
    fetchWithQuery,
    {immediate: true}
  )

  function submitFilter() {
    if (!results.value || !(results.value as any).filterConfig) {
      return
    }
    fetchWithQuery()
  }

  function fetchWithQuery() {
    const config = results.value ? (results.value as any).filterConfig : interimConfig
    const query = filterAsString(convertToBackendFilter(filterData.value, config), config, false, true)
    if (results.value) {
      const filter = filterAsUrlParam(filterData.value, config)
      router.replace({query: {filter}})
    }
    // We replace the query, but we only parse the value on first load of the page
    fetch({query}).then((r: any) => {
      if (r.filterConfig) {
        r.filterConfig = parseFilterConfigFromBackend(r.filterConfig)
      }
      results.value = r
    })
  }

  return {results, filterData, submitFilter}
}
