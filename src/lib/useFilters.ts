import {BaseGroupFilter, Filter, FilterConfig, FilterOperator} from "/@/lib/filters";

const groupOptions = [
  ['_all_', 'All Of ...', 'group'],
  ['_any_', 'Any Of ...', 'group'],
]


/**
 * Create functions and properties used in filter-related components
 *
 * @param props
 * @param emit
 */
export function useFilters(props: { config: FilterConfig, filter: Filter }, emit: (event: 'update:filter', data: Filter) => void) {
  const funcs = {
    defaultOption: Object.keys(props.config)[0],
    groupOptions,
    createFilter(code: string, operator?: FilterOperator): Filter {
      const _config = props.config[code]
      const children = ('children' in props.filter) ? (props.filter as BaseGroupFilter).children || [] : []
      if (code === '_all_') {
        return {type: 'group', combinationType: 'all', children}
      } else if (code === '_any_') {
        return {type: 'group', combinationType: 'any', children}
      } else if (_config.type === 'preset') {
        return {type: 'preset', name: code}
      } else {
        const value = ((_config.type === 'datetime') || (_config.type === 'date')) ? null : ''
        return {type: 'attribute', attribute: code, operator: operator || _config.operators[0], value}
      }
    },
    filterOptions: groupOptions.concat(Object.keys(props.config).map((code) => [
      code,
      props.config[code].label,
      (props.config[code].type === 'preset') ? 'preset' : 'attribute'
    ])),
    changeFilter(code: string) {
      emit('update:filter', funcs.createFilter(code))
    },
    updateChild(i: number, filter: Filter) {
      const children = (props.filter as BaseGroupFilter).children.slice()
      children.splice(i, 1, filter)
      emit('update:filter', Object.assign({}, props.filter, {children}))
    },
    addDefaultChild(code?: string) {
      return funcs.addChild(funcs.createFilter(code || funcs.defaultOption))
    },
    addChild(filter: Filter) {
      emit('update:filter', Object.assign({}, props.filter, {children: (props.filter as BaseGroupFilter).children.concat(filter)}))
    },
    removeChild(i: number) {
      const children = (props.filter as BaseGroupFilter).children.slice()
      children.splice(i, 1)
      emit('update:filter', Object.assign({}, props.filter, {children}))
    },
  }
  return funcs
}
