<script lang="ts">
  import dayjs from 'dayjs'
  import { PropType, reactive, computed } from 'vue'
  import { Category, calcMonths, bills, categories } from '../data'

  type Selected = {
    month?: dayjs.Dayjs
    category?: Category
  }

  export default {
    props: {
      selected: {
        type: Object as PropType<Selected>,
        required: true,
      },
    },
    setup() {
      return {
        months: computed(() => calcMonths(bills.value)),
        categories,
      }
    }
  }

  export function useSelected() {
    return reactive<Selected>({})
  }
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
