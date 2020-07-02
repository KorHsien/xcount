declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}

declare module '*.csv' {
  const content: unknown[]
  export default content
}
