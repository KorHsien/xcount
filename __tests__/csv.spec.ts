import { parse } from "../src/data/csv"

describe('csv parser', () => {
  it('parse csv to array of objects', () => {
    const csv = `
      foo,bar
      a,1
      b,2
    `
    
    expect(parse(csv)).toEqual([
      { foo: 'a', bar: 1 },
      { foo: 'b', bar: 2 },
    ])
  })
})
