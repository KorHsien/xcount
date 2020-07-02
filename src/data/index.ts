import * as R from 'ramda'
import { ref } from 'vue'
import { initStore, Bill } from './store'
import rawBills from './bill.csv'
import rawCategories from './categories.csv'

export * from './store'

export const { bills, categories } = R.evolve(
  { bills: (_: Bill[]) => ref(_) }, // add type hint
  initStore(rawBills, rawCategories),
)
