<script setup="props" lang="ts">
  import { Bill } from '../data'

  declare const props: {
    bills: Bill[]
  }
</script>

<template>
  <table v-if="bills.length">
    <tbody>
      <tr v-for="(bill, index) in bills" :key="index">
        <td>
          <div v-text="bill.$category.name" />
          <div
            class="time"
            v-text="bill.$time.format('YYYY/M/D')"
            :title="bill.$time.format()"
          />
        </td>
        <td v-text="bill.$type" />
        <td v-text="bill.$amount" />
      </tr>
    </tbody>
  </table>
  <div class="empty" v-else>无</div>
</template>

<style scoped>
  td {
    padding: 10px 6px;
  }

  td:first-child {
    width: 50%;
  }

  .time {
    color: var(--text-muted);
    font-size: .8em;
    margin-top: 2px;
  }

  .empty {
    margin-top: 128px;
    text-align: center;
  }
</style>
