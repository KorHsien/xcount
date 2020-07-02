<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue'
  import { Bill, calcSumByTypes } from '../data'

  export default defineComponent({
    props: {
      bills: {
        type: Array as PropType<Bill[]>,
        required: true,
      },
    },
    setup(props) {
      return {
        sumByTypes: computed(() => calcSumByTypes(props.bills)),
      }
    }
  })
</script>

<template>
  <table>
    <tbody>
      <tr v-for="sumByType in sumByTypes" :key="sumByType.type">
        <td v-text="sumByType.$type" />
        <td v-text="sumByType.$amount" />
      </tr>
    </tbody>
  </table>

  <details open>
    <summary>分类合计</summary>

    <table v-for="sumByType in sumByTypes" :key="sumByType.type">
      <tbody>
        <tr>
          <td
            :rowspan="sumByType.sumByCategories.length + 1"
            v-text="sumByType.$type"
          />
          <td v-if="!sumByType.sumByCategories.length">无</td>
        </tr>

        <tr
          v-for="sumByCategory in sumByType.sumByCategories"
          :key="sumByCategory.category"
        >
          <td v-text="sumByCategory.$category.name" />
          <td v-text="sumByCategory.$amount" />
        </tr>
      </tbody>
    </table>
  </details>
</template>

<style scoped>
  tbody tr {
    background: none;
  }
</style>
