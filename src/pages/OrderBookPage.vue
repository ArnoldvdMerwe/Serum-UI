<script lang="ts">
import { defineComponent } from 'vue';
import ChartComponent from 'src/components/ChartComponent.vue';
import axios from 'axios';

export default defineComponent({
  name: 'MeterDataPage',
  components: {
    ChartComponent
  },

  data() {
    return {
      pagination: {
        rowsPerPage: 10,
        sortBy: 'value',
        descending: true
      },
      paginationList: [2, 5, 10, 15, 20],

      sellTableColumns: [] as Record<string, unknown>[],
      sellData: [] as {
        value: number;
        quantity: number;
        totalquantity: number;
      }[],
      // Data given to table is different than fetched data so that the data is correctly formatted with pagination
      displaySellData: [] as {
        value: number;
        quantity: number;
        totalquantity: number;
      }[],
      buyTableColumns: [] as Record<string, unknown>[],
      buyData: [] as {
        value: number;
        quantity: number;
        totalquantity: number;
      }[],

      chartData: {
        datasets: [
          {
            data: [] as { x: number; y: number }[],
            showLine: true,
            borderColor: 'rgba(0, 255, 0, 1)',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            fill: 'start'
          },
          {
            data: [] as { x: number; y: number }[],
            showLine: true,
            borderColor: 'rgba(255, 0, 0, 1)',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            fill: 'end'
          }
        ]
      },
      chartDataLoaded: false,

      fuelSourceType: 'SOLAR',
      fuelSourceTypeList: ['SOLAR', 'WIND', 'GEOTHERMAL', 'HYDROPOWER']
    };
  },
  async created() {
    this.sellTableColumns = [
      {
        name: 'value',
        required: true,
        align: 'left',
        style: 'color: red',
        field: 'value',
        format: (val: number) => `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'quantity',
        align: 'left',
        field: 'quantity',
        format: (val: number) => `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: number) => `${(Math.round(val * 100) / 100).toFixed(1)}`
      }
    ];

    this.buyTableColumns = [
      {
        name: 'value',
        required: true,
        align: 'left',
        style: 'color: green',
        field: 'value',
        format: (val: number) => `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'quantity',
        align: 'left',
        field: 'quantity',
        format: (val: number) => `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: number) => `${(Math.round(val * 100) / 100).toFixed(1)}`
      }
    ];

    // Setup data for sell (asks) portion of graph
    this.sellData = await this.fetchSellData();
    this.chartData.datasets[1].data = this.sellData.map((item) => ({
      x: item.totalquantity,
      y: item.value
    }));
    this.chartData.datasets[1].data.push({
      x: 0,
      y: this.sellData[this.sellData.length - 1].value
    });
    // Setup table for sell orders
    // Need to look at displayed number of orders and show the correct ones
    // The sell order table needs to show the orders closest to the buy orders
    this.displaySellData = this.sellData;
    this.changeDisplayedSellOrders();

    // Setup data for buy (bids) portion of graph
    this.buyData = await this.fetchBuyData();
    this.chartData.datasets[0].data = this.buyData.map((item) => ({
      x: item.totalquantity,
      y: item.value
    }));
    this.chartData.datasets[0].data.unshift({ x: 0, y: this.buyData[0].value });
    this.chartDataLoaded = true;
  },

  methods: {
    async fetchSellData(): Promise<
      { value: number; quantity: number; totalquantity: number }[]
    > {
      const response = await axios.get(
        'http://localhost:5000/api/orderdata/sell'
      );
      return response.data;
    },

    async fetchBuyData(): Promise<
      { value: number; quantity: number; totalquantity: number }[]
    > {
      const response = await axios.get(
        'http://localhost:5000/api/orderdata/buy'
      );
      return response.data;
    },

    // Show sell orders closest to the highest buy orders
    changeDisplayedSellOrders() {
      if (this.pagination.rowsPerPage < this.sellData.length) {
        this.displaySellData = this.sellData.slice(
          -this.pagination.rowsPerPage
        );
      } else {
        this.displaySellData = this.sellData;
      }
    }
  }
});
</script>

<template lang="pug">
q-page.fit(
  padding
  )
  div.row.items-start.justify-between
    div.col-2
      q-select(
        bg-color = "white"
        filled
        v-model = 'fuelSourceType'
        :options = 'fuelSourceTypeList'
        label = 'List of fuel source types'
      )
    div.row.col-8.flex-center
      div.col-6(
        style = "height: 60vh"
        v-if = 'chartDataLoaded'
      )
        ChartComponent.q-pa-md(
          type = 'scatter'
          :data = 'chartData'
        )
      div.col-3
        q-table(
          v-model:pagination = "pagination"
          :rows = "displaySellData"
          :columns = "sellTableColumns"
          row-key = "value"
          hide-bottom
          hide-header
          dark
          dense
          square
          flat
        )
        h5.row.flex-center.bg-dark.text-white(
          style = 'margin: 0px'
        ) Show last transaction here
        q-table(
          v-model:pagination = "pagination"
          :rows = "buyData"
          :columns = "buyTableColumns"
          row-key = "value"
          hide-bottom
          hide-header
          dark
          dense
          square
          flat
        )
    div.col-2
      q-select(
        bg-color = "white"
        filled
        v-model = 'pagination.rowsPerPage'
        :options = 'paginationList'
        label = 'Number of orders'
        @update:model-value = 'changeDisplayedSellOrders'
      )
</template>
