import {fireEvent, render} from '@testing-library/vue'
import {FilterConfig, FilterOperators} from '/@/lib/filters'
import FilterGroup from '/@/components/filter/FilterGroup.vue'

const config: FilterConfig = {
  name: {type: 'string', operators: FilterOperators.string, label: 'Name'},
  age: {type: 'numeric', operators: FilterOperators.numeric, label: 'Age'},
  dob: {type: 'datetime', operators: FilterOperators.datetime, label: 'Date of Birth'}
}

test('default rendering', async () => {
  const component = render(FilterGroup, {props: {config: config}})
  const combinationType = component.container.querySelector('#filter-group_combination-type') as HTMLSelectElement
  expect(combinationType.value).toBe('all')
  const addButton = component.getByRole('button', {name: /add/i})
  await fireEvent.click(addButton)
})
