import {removeOuterParentheses} from "/@/lib/helpers";
import {compressFilter, uncompressFilter} from "/@/lib/filterCompression";
import {AttributeTypeName, attributeTypes} from "/@/lib/attributeTypes";

export type FilterType = AttributeTypeName | 'preset'
// BETWEEN could be a UI sugar if >= and <= are allowed.
export type FilterOperator = '=' | '!=' | '>' | '<' | '<=' | '>=' | '~' | 'in' | '!in' | '><'

export const DefaultFilter: BaseGroupFilter = {combinationType: 'all', children: []}

export interface FilterAttributeConfig {
  type: AttributeTypeName,
  operators: FilterOperator[],
  options?: [any, string][] | null,
  label: string
}

export interface FilterPresetConfig {
  type: 'preset',
  label: string
}

export type SingleFilterConfig = FilterAttributeConfig | FilterPresetConfig

export interface FilterConfig {
  [attribute: string]: SingleFilterConfig
}

export function filterConfig(type: FilterType, label: string) {
  const operators = FilterOperators[type] || null
  return (operators === null) ? {type, label} : {type, operators, label}
}

export const FilterOperators: { [type: string]: FilterOperator[] } = {
  string: ['=', '!=', '~'],
  numeric: ['=', '!=', '>', '<', '<=', '>='],
  datetime: ['>', '<'],
}

export function isMultiOperator(operator: string) {
  return ['in', '!in'].includes(operator)
}

export interface AttributeFilter<T> {
  type: 'attribute'
  attribute: string,
  operator: FilterOperator,
  value: T
}

export interface PresetFilter {
  type: 'preset'
  name: string
  value?: any
}

export interface BaseGroupFilter {
  combinationType: 'all' | 'any',
  children: Filter[]
}

export interface GroupFilter extends BaseGroupFilter {
  type: 'group'
}

export type Filter = AttributeFilter<any> | PresetFilter | GroupFilter | BaseGroupFilter

/**
 * Convert a full filter to a string representation either human-readable, or machine-readable
 * @param filter
 * @param config
 * @param human
 * @param root
 */
export function filterAsString(filter: Filter, config: FilterConfig, human = true, root = true): string {
  if (!('type' in filter) || filter.type === 'group') {
    const sep = (filter.combinationType == 'all') ? ' and ' : ' or '
    const str = filter.children
      .map((f) => filterAsString(f, config, human, false))
      .filter((s) => s && (s != '()'))
      .join(sep)
    return root ? removeOuterParentheses(str) : `(${str})`
  } else if (filter.type === 'preset') {
    const valueStr = filter.value ? ' ' + filter.value : ''
    return (human ? `[${config[filter.name].label}]` : filter.name) + valueStr
  } else if (filter.type === 'attribute') {
    if ((filter.value === undefined) || (filter.value === null)) {
      return ''
    }
    const valueStr = filterValueAsString(filter, config[filter.attribute] as FilterAttributeConfig, human)
    const nameStr = human ? `[${config[filter.attribute].label}]` : filter.attribute
    const operator = filter.operator === '><' ? 'between' : filter.operator
    return valueStr ? `${nameStr} ${operator} ${valueStr}` : ''
  }
  return ''
}

/**
 * Convert filter from a UI Filter to one compatible with backend
 *
 * - Filter with Range/between  operator is replaced by a group of >= and <=.
 * - Date = is replaced with a group of  >= start of day and <= end of day.
 * @param filter
 * @param config
 */
export function convertToBackendFilter(filter: Filter, config: FilterConfig): Filter {
  const attrFilter = filter as AttributeFilter<any>
  const groupFilter = filter as BaseGroupFilter
  if (attrFilter.attribute && (config[attrFilter.attribute].type === 'date') && ['=', '!='].includes(attrFilter.operator)) {
    const baseValue = attrFilter.value as number
    const [op1, op2] = (attrFilter.operator === '=') ? ['>=', '<='] : ['<=', '>=']
    const type = (attrFilter.operator === '=') ? 'all' : 'any'
    return {
      combinationType: type, children: [
        Object.assign({}, filter, {operator: op1, value: baseValue}),
        Object.assign({}, filter, {operator: op2, value: baseValue+86400})
      ]
    }
  }
  if (attrFilter.operator === '><') {
    const [from, to] = Array.isArray(attrFilter.value) ? attrFilter.value : [attrFilter.value, null]
    if ((from === null) && (to === null)) {
      return DefaultFilter
    } else if (from === null) {
      return Object.assign({}, filter, {operator: '<=', value: to})
    } else if (to === null) {
      return Object.assign({}, filter, {operator: '>=', value: from})
    } else {
      return {
        combinationType: 'all', children: [
          Object.assign({}, filter, {operator: '>=', value: from}),
          Object.assign({}, filter, {operator: '<=', value: to})
        ]
      }
    }
  } else if (groupFilter.children) {
    const children = groupFilter.children.map((f) => convertToBackendFilter(f, config))
    // remove unnecessary nesting (which could result in base filter being wrapped in parentheses).
    return ((children.length == 1) && ((children[0] as BaseGroupFilter).combinationType))
      ? children[0] : Object.assign({}, filter, {children})
  }
  return filter
}

/**
 * Enhance backend filter config with features available for this UI.
 *
 * - Adds range/between filter operator
 * @param config
 */
export function parseFilterConfigFromBackend(config: FilterConfig) {
  return Object.fromEntries(Object.entries(config).map(e => {
    const [key, config] = e
    const attrConfig = config as FilterAttributeConfig
    return (attrConfig.operators && attrConfig.operators.includes('>=') && attrConfig.operators.includes('>='))
      ? [key, Object.assign({}, config, {operators: attrConfig.operators.concat('><')})]
      : [key, config]
  }))
}

/**
 * Converts a full filter to a string suitable for a URL parameter.
 *
 * Because we don't want full parsing code to add weight to the client,
 * we create a minimized representation of the full filter, and then base64 encode it to
 * @param filter
 * @param config
 */
export function filterAsUrlParam(filter: Filter, config: FilterConfig): string | undefined {
  return (
    ((filter as BaseGroupFilter).combinationType == DefaultFilter.combinationType)
    && ((filter as BaseGroupFilter).children.length == 0)
  )
    ? undefined
    : btoa(JSON.stringify(compressFilter(filter, config)))
}

/**
 * Extract a full filter and some 'interim' config from a URL parameter representation of the filter.
 *
 * The 'interim' config is enough to render a human or machine-readable
 *
 * @param string
 */
export function baseFilterAndInterimConfigFromUrlParam(string: string): { filter: BaseGroupFilter, config: FilterConfig } {
  const config = {}
  const f = string
    ? uncompressFilter(JSON.parse(atob(string)), config)
    : DefaultFilter
  const filter: BaseGroupFilter = (f as BaseGroupFilter).combinationType
    ? f as BaseGroupFilter
    : {combinationType: 'all', children: [f]} as BaseGroupFilter
  return {filter, config}
}

/**
 * Render the _value_ part of a single attribute's filter to a string.
 *
 * For the backend, the value may e.g. be wrapped in quotes for a string.
 * For the frontend, e.g. dates may be rendered as strings from a numeric representation.
 * @param filter
 * @param config
 * @param human
 */
export function filterValueAsString(filter: AttributeFilter<any>, config: FilterAttributeConfig, human = true) {
  const t = attributeTypes[config.type]
  if (!t) {
    throw Error(`Cannot find a UI Type for ${config.type}`)
  }
  return (human && t.toHumanString) ? t.toHumanString(filter, config) : t.toFilterString(filter, config)
}
