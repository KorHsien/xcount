# Logging

## Dynamic Type

The [data store](./src/data/store.ts) defined four property descriptors `$type`, `$time`, `$category` and `$amount`, and created a `Bill` constructor:

```ts
const Bill = dynamicTypeFactory({ $type, $time, $category, $amount })
```

The properties of constructor prototype are defined by those descriptors, so that the return type of `Bill` will be:

```ts
type Bill = {
  type: BillType
  time: number
  category: string
  amount: number
  $type: '支出' | '收入'
  $time: dayjs.Dayjs
  $category: Category
  $amount: string
}
```

I named this pattern "dynamic type". (Probably a bad name.)

This pattern allow us to attach derived data to the original data, and also act as a little ORM to link to relational data.

Compared to other alternatives like:

- Use-site transformation possibly extracted to helper functions
- Pre-transformation in the data store

This pattern have these advantages:

- Reusability, the property descriptors can be easily composed for different data types
- Cohesiveness, the data transformations are grouped together, provide easy access to derived and relational data

The current implementation of linking relational data is a bit twisted, there're opportunities to improve and provide a proper way of expressing ORM.

## Mutable Props

For code organization, controls for filtering bills are extracted to [Header](./src/components/Header.vue) component, but the state for selected options should remain in the parent component [App](./src/App.vue).

In the context of advocating [One-Way Data Flow](https://vuejs.org/v2/guide/components-props.html#One-Way-Data-Flow), and the warning of "Avoid mutating a prop directly...", the typical suggestion for these scenarios is to pass state from parents to children, and then emit changes from children back to parents.

But I feel it being a bit hassle, it increases the burden of extracting components. Maybe this situation can be improved, I created an [issue](https://github.com/vuejs/rfcs/issues/165) in Vue RFCs, check it out for more details.

## In Praise of CSS Grid

In order to make better use of larger screens, the desktop version have a two-column design:

```
    Mobile                   Desktop
+------------+      +------------+ +---------+
|   Header   |      |   Header   | |         |
+------------+      +------------+ | NewBill |
+------------+      +------------+ |         |
|            |      |            | +---------+
|            |      |            | +---------+
|    Sum     |      |            | |         |
|            |      |    List    | |         |
|            |      |            | |   Sum   |
+------------+      |            | |         |
+------------+      |            | |         |
|            |      +------------+ +---------+
|            |
|            |
|    List    |
|            |
|            |
|            |
+------------+
```

The difference between two screen sizes is so significant that we traditionally can't have a single HTML or component structure to accommodate both conditions, instead use JavaScript to create conditional layouts based on screen size.

Here comes CSS Grid. CSS Grid can express very versatile layouts, which can be easily changed based on media query or other conditions. We are free to change the layout and move items around to suit our needs.

CSS Grid is a very powerful tool, it allow us to build complex layouts without multiple layers of nesting, and achieve responsive designs in a breeze. Now that browser supports for CSS Grid are considerably good, it's time to invest on it.
