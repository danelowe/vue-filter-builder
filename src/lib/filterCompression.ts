import {
  AttributeFilter,
  BaseGroupFilter,
  Filter,
  FilterAttributeConfig,
  FilterConfig, PresetFilter
} from "/@/lib/filters";
import {attributeTypes} from "/@/lib/attributeTypes";

const typesByCompressedCode = Object.fromEntries(Object.entries(attributeTypes).map(e =>
  [e[1].compressedCode, Object.assign({}, e[1], {code: e[0]})]
))


export type CompressedFilter = [string, CompressedFilter[] | any] | string

/**
 * Compress a filter by creating an easily-parsable string representation of the full filter.
 *
 * Aimed to generate the smallest string that is easily parsed with javascript.
 * @param filter
 * @param config
 */
export function compressFilter(filter: Filter, config: FilterConfig): CompressedFilter {
  if (!('type' in filter) || filter.type === 'group') {
    return [`g:${filter.combinationType}`, filter.children.map(f => compressFilter(f, config))]
  } else if (filter.type === 'preset') {
    return filter.value ? [`p:${filter.name}`, filter.value] : `p:${filter.name}`
  } else if (filter.type === 'attribute') {
    const attrConfig = config[filter.attribute] as FilterAttributeConfig
    return [`a:${filter.attribute}:${filter.operator}`, compressFilterValue(filter, attrConfig)]
  } else {
    throw Error("Don't know how to compress " + filter)
  }
}

/**
 * Convert a minimal string representation of a filter to a full representation of the same filter
 * @param compressedFilter
 * @param configToFill
 */
export function uncompressFilter(compressedFilter: CompressedFilter, configToFill: FilterConfig): Filter | null {
  const [header, value] = (typeof compressedFilter === 'string') ? [compressedFilter, undefined] : compressedFilter
  const [type, ...parts] = header.split(':')
  if (type === 'g') {
    return {
      combinationType: parts[0],
      children: value.map((f: CompressedFilter) => uncompressFilter(f, configToFill)).filter((f: Filter) => !!f)
    } as BaseGroupFilter
  } else if (type === 'p') {
    return {type: 'preset', name: parts[0], value} as PresetFilter
  } else if (type === 'a') {
    const v = uncompressFilterValue(value, parts[0], parts[1], configToFill)
    return (v === null)
      ? null
      : {type: 'attribute', attribute: parts[0], operator: parts[1], value: v} as AttributeFilter<any>
  } else {
    throw Error("Don't know how to uncompress " + compressedFilter)
  }
}

/**
 * Converts a string representation of a value to the actual value.
 * @param value
 * @param attributeName
 * @param operator
 * @param configToFill
 */
function uncompressFilterValue(value: string, attributeName: string, operator: string, configToFill: FilterConfig) {
  const [typeCode, strVal] = value.split(':')
  const type = typesByCompressedCode[typeCode]
  configToFill[attributeName] = Object.assign(configToFill[attributeName] || {}, {type: type.code})
  return type.fromString(strVal, operator)
}

/**
 * Converts the value part from a single attribute's filter to a string that can be used in compression
 * @param filter
 * @param config
 */
function compressFilterValue(filter: AttributeFilter<any>, config: FilterAttributeConfig) {
  const type = attributeTypes[config.type] as any
  const v = filter.value == null ? null : type.toFilterString(filter, config)
  return `${type.compressedCode}:${v}`
}
