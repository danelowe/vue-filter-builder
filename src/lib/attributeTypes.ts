import {AttributeFilter, FilterAttributeConfig, isMultiOperator} from "/@/lib/filters";

interface AttributeType<T> {
  code: string
  compressedCode: string

  fromString(string: string, operator: string): T

  toFilterString(filter: AttributeFilter<T>, config: FilterAttributeConfig): string

  toHumanString?(filter: AttributeFilter<T>, config: FilterAttributeConfig): string
}

// @todo: register attribute types on startup rather than use a large config here.
export const attributeTypes = {
  string: {
    compressedCode: 's',
    fromString(string, op): string {
      return string.replace(/^'|'$/g, '').replace('\\x27', "'");
    },
    toFilterString(filter, config): string {
      return `'${filter.value.replace("'", '\\x27')}'`
    }
  } as AttributeType<string>,
  numeric: {
    compressedCode: 'n',
    fromString(string, op): number | number[] {
      return string.includes(',') ? string.split(',').map((s) => parseFloat(s)) : parseFloat(string)
    },
    toFilterString(filter, config): string {
      const v: number[] = Array.isArray(filter.value) ? filter.value as number[] : [filter.value as number]
      return v.map((n: number) => n ? n.toString() : '').join(',')
    },
    toHumanString(filter, config): string {
      const v: number[] = Array.isArray(filter.value) ? filter.value as number[] : [filter.value as number]
      return v.map((n: number) => n ? n.toString() : '').join(' and ')}
  } as AttributeType<number>,
  date: {
    compressedCode: 'd',
    fromString(string, op): number | number[] {
      return string.includes(',') ? string.split(',').map((s) => parseInt(s)) : parseInt(string)
    },
    toFilterString(filter, config): string {
      const v: number[] = Array.isArray(filter.value) ? filter.value as number[] : [filter.value as number]
      return v.map((d: number) => d ? d.toString() : '').join(',')
    },
    toHumanString(filter, config): string {
      const v: number[] = Array.isArray(filter.value) ? filter.value as number[] : [filter.value as number]
      return v.map((d: number) => d ? (new Date(d * 1000)).toLocaleDateString() : '').join(' and ')
    }
  } as AttributeType<number>,
  datetime: {
    compressedCode: 'dt',
    fromString(string, op): number | number[] {
      return string.includes(',') ? string.split(',').map((s) => parseInt(s)) : parseInt(string)
    },
    toFilterString(filter, config): string {
      const v: number[] = Array.isArray(filter.value) ? filter.value as number[] : [filter.value as number]
      return v.map((d: number) => d ? d.toString() : '').join(',')
    },
    toHumanString(filter, config): string {
      const v: number[] = Array.isArray(filter.value) ? filter.value as number[] : [filter.value as number]
      return v
        .map((d: number) => d ? (new Date(d * 1000)).toLocaleString() : '')
        .join(' and ')
    }
  } as AttributeType<number>,
  options: {
    compressedCode: 'o',
    fromString(string, op): any {
      // This is parsed as an identifier, reserved words should not be used as enum options
      if (string === 'false') {
        return false
      }
      if (string === 'true') {
        return true
      }
      return (isMultiOperator(op)) ? string.split(',') : string
    },
    toFilterString(filter, config): string {
      return Array.isArray(filter.value) ? filter.value.join(',') : filter.value.toString()
    },
    toHumanString(filter, config): string {
      const values = (Array.isArray(filter.value) ? filter.value : [filter.value])
      return config.options?.filter((o) => values.includes(o[0])).map((o) => o[1]).join(', ') || ''
    }
  } as AttributeType<any>
}

export type AttributeTypeName = keyof typeof attributeTypes
