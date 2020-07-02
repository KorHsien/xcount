<script lang="ts">
  import { defineComponent } from 'vue'
  import { useNewBill, bills, categories } from '../data'

  export default defineComponent({
    setup(props, { emit }) {
      const { newBill, addBill } = useNewBill(bills.value)

      function onAddBill() {
        addBill()
        newBill.amount = undefined
        emit('added')
      }

      return {
        categories,
        newBill,
        onAddBill,
      }
    }
  })
</script>

<template>
  <form @submit.prevent="onAddBill">
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
