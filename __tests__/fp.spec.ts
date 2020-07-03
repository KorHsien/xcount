import * as R from 'ramda'
import { sumBy, mapIndexed, filterWith } from '../src/utils'

describe('fp helpers', () => {
  test('sumBy', () => {
    const list = [
      { amount: 2 },
      { amount: 3 },
      { amount: 5 },
    ]

    expect(sumBy(R.prop('amount'), list)).toBe(10)
    expect(sumBy<{ amount: number }>(R.prop('amount'))(list)).toBe(10)
  })

  test('mapIndexed', () => {
    const list = ['a', 'b', 'c']
    const mapped = [
      ['a', 0, list],
      ['b', 1, list],
      ['c', 2, list],
    ]

    expect(mapIndexed(Array.of, list)).toEqual(mapped)
    expect(mapIndexed<string, any[]>(Array.of)(list)).toEqual(mapped)
  })

  test('filterWith', () => {
    const list = [
      { a: 1, b: 2},
      { a: 1, b: 3},
      { a: 2, b: 5},
    ]

    const filterByA = filterWith<number, { a: number }>(R.propEq('a'))

    expect(filterByA(undefined, list)).toBe(list)
    expect(filterByA(1, list)).toEqual([
      { a: 1, b: 2},
      { a: 1, b: 3},
    ])
  })
})
