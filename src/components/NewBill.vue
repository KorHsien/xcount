<script setup="_, { emit }" lang="ts">
  import * as R from 'ramda'
  import { useNewBill, bills } from '../data'
  
  export { categories } from '../data'

  declare function emit(e: 'added'): void

  export const { newBill, addBill } = R.applyTo(
    useNewBill(bills.value),
    ({ newBill, addBill }) => ({
      newBill,
      addBill() {
        addBill()
        newBill.amount = undefined
        emit('added')
      },
    }),
  )
</script>

<template>
  <form @submit.prevent="addBill">
    <fieldset>
      <legend>添加账单</legend>

      <label>分类
        <select v-model="newBill.category" required>
          <option :value="undefined" disabled>请选择</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            v-text="category.name"
          />
        </select>
      </label>

      <label>金额
        <input
          v-model="newBill.amount"
          type="number"
          placeholder="请输入金额"
          required
        >
      </label>
      
      <button type="submit">添加</button>
    </fieldset>
  </form>
</template>

<style scoped>
  button {
    margin-top: 10px;
  }
</style>
