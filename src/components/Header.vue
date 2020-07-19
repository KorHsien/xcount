<script lang="ts">
  type Selected = {
    month?: dayjs.Dayjs
    category?: Category
  }

  export function useSelected() {
    return reactive<Selected>({})
  }
</script>

<script setup="props" lang="ts">
  import dayjs from 'dayjs'
  import { reactive, computed } from 'vue'
  import { Category, calcMonths, bills } from '../data'

  export { categories } from '../data'

  declare const props: {
    selected: Selected
  }

  export const months = computed(() => calcMonths(bills.value))
</script>

<template>
  <div class="header">
    <label>账单时间
      <select v-model="selected.month">
        <option :value="undefined">全部</option>
        <option
          v-for="month in months"
          :key="+month"
          :value="month"
          v-text="month.format('YYYY年M月')"
        />
      </select>
    </label>

    <label>账单分类
      <select v-model="selected.category">
        <option :value="undefined">全部</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category"
          v-text="category.name"
        />
      </select>
    </label>
    
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  .header {
    display: flex;
  }

  label {
    display: inline-block;
    margin: 20px 6px;
  }

  select {
    display: inline-block;
    margin: 0;
  }

  .slot {
    margin: auto 0 20px;
  }
</style>
