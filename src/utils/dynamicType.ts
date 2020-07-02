type Id<T> = { [K in keyof T]: T[K] }

// https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (
  U extends object ? (k: U) => void : never
) extends (k: infer I) => void ? I : never

export type PropertyDescripterWith<T extends object, V = unknown> =
  PropertyDescriptor & ThisType<T> & {
    value?: V
    get?(this: T): V
    set?(this: T, v: V): void
  }

type ValueTypeOf<T extends PropertyDescriptor> =
  T extends PropertyDescripterWith<object, infer V> ? V : never

type ThisTypeOf<T extends PropertyDescriptor> =
  T extends PropertyDescripterWith<infer V> ? V : never

interface DynamicTypeConstructor<
  PDM extends PropertyDescriptorMap,
  P = { [P in keyof PDM]: ValueTypeOf<PDM[P]> },
  T = Id<UnionToIntersection<ThisTypeOf<PDM[keyof PDM]>> & P>
> {
  <O>(obj: O & ThisType<T & O>): T & O

  prototype: P
}

/**
 * Return a constructor that the properties of its prototype are defined by
 * given descriptors.
 * @param properties property descriptor map
 */
export function dynamicTypeFactory<PDM extends PropertyDescriptorMap>(
  properties: PDM
) {
  const DynamicType: DynamicTypeConstructor<PDM> = function (obj) {
    return Object.setPrototypeOf(obj, DynamicType.prototype)
  }

  Object.defineProperties(DynamicType.prototype, properties)

  return DynamicType
}
