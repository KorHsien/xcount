import * as R from 'ramda'

const parseCol = R.ifElse(
  R.pipe(Number, Number.isNaN),
  R.trim,
  Number,
)

const parseRow = R.pipe(
  R.split(','),
  R.map(parseCol),
)

export const parse: (str: string) => unknown[] = R.pipe(
  R.trim,
  R.split('\n'),
  R.map(parseRow),
  R.converge(R.map, [
    R.pipe(R.head, R.zipObj),
    R.tail,
  ]),
)
