import dayjs from 'dayjs'
import * as R from 'ramda'
import { reactive } from 'vue'
import { dynamicTypeFactory, filterWith, sumBy, mapIndexed } from '../utils'

const BILL_TYPES = { 0: '支出', 1: '收入' } as const

type BillType = keyof typeof BILL_TYPES

export interface Category {
  id: string
  type: BillType
  name: string
}

let categoryMap: { [id: string]: Category } | undefined

function getCategory(id: string) {
  if (!categoryMap) {
    throw new Error('store unintialized')
  }

  return categoryMap[id]
}

const $type = {
  get(this: { type: BillType }) {
    return BILL_TYPES[this.type]
  },
}

const $time = {
  get(this: { time: number }) {
    return dayjs(this.time)
  },
}

const $category = {
  get(this: { category: string }) {
    return getCategory(this.category)
  },
}

const $amount = {
  get(this: { amount: number }) {
    return this.amount.toFixed(2)
  },
}

export const Bill = dynamicTypeFactory({ $type, $time, $category, $amount })

export type Bill = ReturnType<typeof Bill>

export function initStore(_bills: unknown[], _categories: unknown[]) {
  const bills = _bills
    .map(Bill)
    .sort(R.descend(R.prop('time')))

  const categories = _categories as Category[]

  categoryMap = R.indexBy(R.prop('id'), categories)

  return { bills, categories }
}

export const filterByMonth = filterWith<dayjs.Dayjs, Bill>(
  (month, bill) => bill.$time.isSame(month, 'month')
)

export const filterByCategory = filterWith<Category, Bill>(
  (category, bill) => bill.category === category.id
)

export const calcMonths = R.pipe(
  R.map<Bill, dayjs.Dayjs>(_ => _.$time.startOf('month')),
  R.uniqBy<dayjs.Dayjs, number>(Number),
)

const sumByAmount = sumBy<Bill>(R.prop('amount'))

const calcSumByCategories = R.pipe(
  R.groupBy<Bill>(R.prop('category')),
  R.toPairs,
  R.map(R.pipe(
    R.evolve({ 1: sumByAmount }),
    R.zipObj(['category', 'amount']),
    dynamicTypeFactory({ $category, $amount }),
  )),
  R.sort(R.descend(R.prop('amount'))),
)

export const calcSumByTypes = R.pipe(
  R.partition<Bill>(R.propEq('type', 0)),
  mapIndexed(R.pipe(
    R.applySpec({
      type: R.nthArg(1),
      amount: sumByAmount,
      sumByCategories: calcSumByCategories,
    }),
    dynamicTypeFactory({ $type, $amount }),
  )),
)

export function useNewBill(bills: Bill[]) {
  const newBill = reactive<{
    category?: string
    amount?: number
  }>({})

  function addBill() {
    if (R.isNil(newBill.category) || R.isNil(newBill.amount)) {
      throw new Error('invalid input')
    }

    bills.unshift(
      Bill({
        ...newBill,
        type: getCategory(newBill.category).type,
        time: Date.now(),
      })
    )
  }

  return {
    newBill,
    addBill,
  }
}
