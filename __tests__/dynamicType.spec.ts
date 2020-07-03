import {
  dynamicTypeFactory,
  PropertyDescripterWith,
} from '../src/utils/dynamicType'

describe('dynamic type', () => {
  it('create dynamic type from property descripter map', () => {
    const $a = {
      value: 0,
    }

    const $b: PropertyDescripterWith<{ b: number }, string> = {
      get() {
        return this.b.toString()
      },
      set(val: string) {
        this.b = +val
      }
    }

    const Foo = dynamicTypeFactory({ $a, $b })
    
    const foo = Foo({
      b: 1,
    })

    expect(foo.$a).toBe(0)

    expect(foo.b).toBe(1)
    expect(foo.$b).toBe('1')

    foo.$b = '2'
    expect(foo.b).toBe(2)
  })
})
