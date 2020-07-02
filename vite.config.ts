import { UserConfig } from 'vite'
import csvTransform from './src/data/csvTransform'

export default {
  transforms: [csvTransform],
} as UserConfig
