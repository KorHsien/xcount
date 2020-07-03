import dayjs from 'dayjs'
import {
  Bill,
  Category,
  initStore,
  filterByMonth,
  filterByCategory,
  calcMonths,
  calcSumByTypes,
  useNewBill,
} from '../src/data/store'

describe('data store', () => {
  let bills: Bill[], categories: Category[]

  beforeEach(() => {
    ;({ bills, categories } = initStore(
      [
        { type: 0, time: +dayjs('2020-01-02'), category: 'b', amount: 1 },
        { type: 0, time: +dayjs('2020-01-07'), category: 'a', amount: 2 },
        { type: 1, time: +dayjs('2020-01-13'), category: 'c', amount: 3 },
        { type: 0, time: +dayjs('2020-01-23'), category: 'a', amount: 5 },
        { type: 1, time: +dayjs('2020-02-02'), category: 'c', amount: 7 },
      ],
      [
        { id: 'a', type: 0, name: 'foo' },
        { id: 'b', type: 0, name: 'bar' },
        { id: 'c', type: 1, name: 'baz' },
      ],
    ))
  })

  it('initialized with sorted bills and additional properties', () => {
    expect(bills).toEqual([
      { type: 1, time: +dayjs('2020-02-02'), category: 'c', amount: 7 },
      { type: 0, time: +dayjs('2020-01-23'), category: 'a', amount: 5 },
      { type: 1, time: +dayjs('2020-01-13'), category: 'c', amount: 3 },
      { type: 0, time: +dayjs('2020-01-07'), category: 'a', amount: 2 },
      { type: 0, time: +dayjs('2020-01-02'), category: 'b', amount: 1 },
    ])

    expect(bills[0].$type).toBe('收入')
    expect(bills[0].$time.isSame(dayjs('2020-02-02'))).toBe(true)
    expect(bills[0].$category).toBe(categories[2])
    expect(bills[0].$amount).toBe('7.00')
  })

  it('filterByMonth', () => {
    expect(filterByMonth(undefined, bills)).toBe(bills)
    expect(filterByMonth(dayjs('2020-01'), bills)).toEqual([
      { type: 0, time: +dayjs('2020-01-23'), category: 'a', amount: 5 },
      { type: 1, time: +dayjs('2020-01-13'), category: 'c', amount: 3 },
      { type: 0, time: +dayjs('2020-01-07'), category: 'a', amount: 2 },
      { type: 0, time: +dayjs('2020-01-02'), category: 'b', amount: 1 },
    ])
  })

  it('filterByCategory', () => {
    expect(filterByCategory(undefined, bills)).toBe(bills)
    expect(filterByCategory(categories[0], bills)).toEqual([
      { type: 0, time: +dayjs('2020-01-23'), category: 'a', amount: 5 },
      { type: 0, time: +dayjs('2020-01-07'), category: 'a', amount: 2 },
    ])
  })

  it('calcMonths', () => {
    const months = calcMonths(bills)
    expect(months).toHaveLength(2)
    expect(months[0].isSame(dayjs('2020-02'))).toBe(true)
    expect(months[1].isSame(dayjs('2020-01'))).toBe(true)
  })

  it('calcSumByTypes', () => {
    const sumByTypes = calcSumByTypes(bills)
    expect(sumByTypes).toEqual([
      {
        type: 0,
        amount: 8,
        sumByCategories: [
          { category: 'a', amount: 7 },
          { category: 'b', amount: 1 },
        ],
      },
      {
        type: 1,
        amount: 10,
        sumByCategories: [
          { category: 'c', amount: 10 },
        ],
      },
    ])

    expect(sumByTypes[0].$type).toBe('支出')
    expect(sumByTypes[0].$amount).toBe('8.00')
    expect(sumByTypes[0].sumByCategories[0].$category).toBe(categories[0])
    expect(sumByTypes[0].sumByCategories[0].$amount).toBe('7.00')
  })

  it('useNewBill', () => {
    jest.useFakeTimers('modern')

    const oldLength = bills.length
    const { newBill, addBill } = useNewBill(bills)
    newBill.category = categories[0].id
    newBill.amount = 11
    addBill()

    expect(bills).toHaveLength(oldLength + 1)
    expect(bills[0]).toEqual({
      type: categories[0].type,
      time: Date.now(),
      category: categories[0].id,
      amount: 11
    })
  })
})
