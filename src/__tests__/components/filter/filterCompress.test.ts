import {
  baseFilterAndInterimConfigFromUrlParam,
  BaseGroupFilter,
  CompressedFilter,
  compressFilter,
  Filter,
  filterAsUrlParam, FilterConfig,
  FilterOperators,
  uncompressFilter
} from '/@/lib/filters'

const filterConfig: FilterConfig = {
  firstName: {type: 'string', operators: FilterOperators.string, label: 'First Name'},
  lastName: {type: 'string', operators: FilterOperators.string, label: 'Last Name'},
  age: {type: 'numeric', operators: FilterOperators.numeric, label: 'Age'},
  dob: {type: 'datetime', operators: FilterOperators.datetime, label: 'Date of Birth'}
}

test('default filter compress and decompress', async  () => {
  const filter: BaseGroupFilter = {combinationType: 'all', children: []}
  const compressedResult = compressFilter(filter, filterConfig)
  expect(filterAsUrlParam(filter, filterConfig)).toEqual(undefined)
  const uncompressedResult = uncompressFilter(compressedResult, filterConfig)
  expect(compressedResult).toEqual(['g:all', []])
  expect(uncompressedResult).toEqual(filter)
  expect(baseFilterAndInterimConfigFromUrlParam('').filter).toEqual(filter)
})

test('filter compress and decompress', async () => {
  const filterValues: [Filter, CompressedFilter][] = [
    [
      {
        combinationType: 'any', children: [
          {attribute: 'firstName', operator: '=', type: 'attribute', value: 'Eleanor'},
          {attribute: 'firstName', operator: '~', type: 'attribute', value: 'Elena'},
        ]
      },
      ['g:any', [['a:firstName:=', "s:'Eleanor'"], ['a:firstName:~', "s:'Elena'"]]]
    ],
    [
      {
        combinationType: 'any', children: [
          {attribute: 'firstName', operator: '=', type: 'attribute', value: 'Eleanor'},
          {
            combinationType: 'all', children: [
              {attribute: 'firstName', operator: '~', type: 'attribute', value: 'Derek'},
              {attribute: 'lastName', operator: '!=', type: 'attribute', value: 'Shellstrop'},

            ]
          },
          {attribute: 'firstName', operator: '!=', type: 'attribute', value: 'Michael'},
        ]
      },
      ['g:any', [['a:firstName:=', "s:'Eleanor'"], ['g:all', [['a:firstName:~', "s:'Derek'"],['a:lastName:!=', "s:'Shellstrop'"]]], ['a:firstName:!=', "s:'Michael'"]]]
    ],
    [
      {
        combinationType: 'all', children: [
          {attribute: 'firstName', operator: '=', type: 'attribute', value: 'Eleanor'},
          {name: 'belongsHere', type: 'preset'},
        ]
      },
      ['g:all', [['a:firstName:=', "s:'Eleanor'"], 'p:belongsHere']]
    ],
    [
      {
        combinationType: 'all', children: [
          {attribute: 'firstName', operator: '~', type: 'attribute', value: 'Eleanor'},
          {attribute: 'firstName', operator: '!=', type: 'attribute', value: 'Eleanor and Chidi'},
        ]
      },
      ['g:all', [['a:firstName:~', "s:'Eleanor'"], ['a:firstName:!=', "s:'Eleanor and Chidi'"]]]
    ]
  ]
  for (const [filter, compressed] of filterValues) {
    const compressedResult = compressFilter(filter, filterConfig)
    const str = filterAsUrlParam(filter, filterConfig)
    expect(typeof str).toBe('string')
    const uncompressedResult = uncompressFilter(compressedResult, filterConfig)
    expect(compressedResult).toEqual(compressed)
    expect(uncompressedResult).toEqual(filter)
    expect(baseFilterAndInterimConfigFromUrlParam(str || '').filter).toEqual(filter)
  }
})

export {}
