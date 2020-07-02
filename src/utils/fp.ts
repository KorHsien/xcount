import * as R from 'ramda'

interface SumBy {
  <T>(fn: (x: T) => number, list: readonly T[]): number
  <T>(fn: (x: T) => number): (list: readonly T[]) => number
}

export const sumBy = R.curry(R.pipe(R.map as any, R.sum)) as SumBy

interface MapIndexed {
  <T, U>(fn: (x: T, i: number, list?: T[]) => U, list: readonly T[]): U[]
  <T, U>(fn: (x: T, i: number, list?: T[]) => U): (list: readonly T[]) => U[]
}

export const mapIndexed: MapIndexed = R.addIndex(R.map) as any

/**
 * Filter a list based on a value using a predicate that takes both the value
 * and the list as arguments.
 * If the value is `undefined`, the list will remain unfiltered.
 * @param fn predicate
 */
export function filterWith<T, U>(
  fn: (t: T, u: U) => boolean
): (t: T | undefined, list: U[]) => U[] {
  return R.ifElse(
    R.isNil,
    R.nthArg(1),
    R.useWith(R.filter, [R.curry(fn)]),
  )
}
