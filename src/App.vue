<script lang="ts">
  import { computed } from 'vue'
  import { bills, filterByMonth, filterByCategory } from './data'
  import Header, { useSelected } from './components/Header.vue'
  import List from './components/List.vue'
  import NewBill from './components/NewBill.vue'
  import Sum from './components/Sum.vue'

  export default {
    components: {
      Header,
      List,
      NewBill,
      Sum,
    },
    setup() {
      const selected = useSelected()

      const billsFilteredByMonth = computed(() =>
        filterByMonth(selected.month, bills.value)
      )
      const billsFiltered = computed(() =>
        filterByCategory(selected.category, billsFilteredByMonth.value)
      )

      return {
        showAddDialog: false,
        selected,
        billsFilteredByMonth,
        billsFiltered,
      }
    }
  }
</script>

<template>
  <div class="container" :class="{ 'show-add-dialog': showAddDialog }">
    <Header class="header" v-model:selected="selected">
      <div class="add-button" @click="showAddDialog = !showAddDialog">
        <span>➕</span>
      </div>
    </Header>

    <div class="right-pane">
      <div class="new-bill">
        <NewBill @added="showAddDialog = false" />
      </div>

      <div class="sum" v-if="selected.month">
        <h3>{{ selected.month.format('YYYY年M月') }} 合计</h3>
        <Sum :bills="billsFilteredByMonth" />
      </div>
    </div>

    <List class="list" :bills="billsFiltered" />
  </div>
</template>

<style scoped>
  .container {
    display: grid;
    justify-content: center;
    column-gap: 32px;
  }

  .header {
    position: sticky;
    top: 0;
    background: var(--background-body);
    display: flex;
  }

  .add-button {
    margin: 0 6px;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
  }

  .add-button span {
    display: inline-block;
    line-height: 1;
    transition: 200ms;
  }

  .right-pane {
    padding: 0 6px;
  }

  .sum {
    margin-bottom: 20px;
  }

  .list {
    margin-bottom: 100px;
  }

  @media (max-width: 599px) {
    .new-bill {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      max-width: 300px;
      height: 240px;
    }

    .container:not(.show-add-dialog) .new-bill {
      display: none;
    }

    .show-add-dialog .add-button::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--background-body);
    }

    .show-add-dialog .add-button span {
      transform: rotate(45deg);
    }
  }

  @media (min-width: 600px) {
    .add-button {
      display: none;
    }

    .right-pane {
      grid-area: 1 / 2 / 4;
      position: sticky;
      top: 0;
      min-width: 240px;
      max-height: 100vh;
      padding-top: 20px;
      overflow-y: auto;
      scrollbar-width: none;
    }

    .right-pane::-webkit-scrollbar {
      display: none;
    }

    .sum {
      margin-bottom: 120px;
    }
  }

  @media (prefers-color-scheme: dark) {
    .add-button span {
      filter: invert(1);
    }
  }
</style>
