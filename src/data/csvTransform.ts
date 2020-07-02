import * as R from 'ramda'
import { Transform } from 'vite'
import { parse } from './csv'

export default {
  test: R.pipe(R.prop('path'), R.endsWith('.csv')),
  transform: R.pipe(
    R.prop('code'),
    parse,
    JSON.stringify,
    R.concat('export default '),
  ),
} as Transform
