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
      displayBuyData: [] as {
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
  async mounted() {
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

    // Fetch data
    this.sellData = await this.fetchSellData();
    this.buyData = await this.fetchBuyData();
    this.displaySellData = this.sellData;
    this.displayBuyData = this.buyData;
    // Change displayed orders according to pagination
    this.changeDisplayedSellOrders();
    this.changeDisplayedBuyOrders();
    this.updateMarketDepthChartData();
    this.chartDataLoaded = true;
    this.updateMarketDepthChartGraph();
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
    },

    changeDisplayedBuyOrders() {
      if (this.pagination.rowsPerPage < this.buyData.length) {
        this.displayBuyData = this.buyData.slice(
          0,
          this.pagination.rowsPerPage
        );
      } else {
        this.displayBuyData = this.buyData;
      }
    },

    updateMarketDepthChartData() {
      this.chartData.datasets[1].data.length = 0;
      this.chartData.datasets[1].data = this.displaySellData.map((item) => ({
        x: item.totalquantity,
        y: item.value
      }));
      this.chartData.datasets[1].data.push({
        x: 0,
        y: this.displaySellData[this.displaySellData.length - 1].value
      });
      this.chartData.datasets[0].data = this.displayBuyData.map((item) => ({
        x: item.totalquantity,
        y: item.value
      }));
      this.chartData.datasets[0].data.unshift({
        x: 0,
        y: this.displayBuyData[0].value
      });
    },

    updateMarketDepthChartGraph() {
      (this.$refs.chart as any).updateChart();
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
      )
        ChartComponent.q-pa-md(
          type = 'scatter'
          :data = 'chartData'
          ref = 'chart'
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
          :rows = "displayBuyData"
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
        @update:model-value = 'changeDisplayedSellOrders(); changeDisplayedBuyOrders(); updateMarketDepthChartData(); updateMarketDepthChartGraph();'
      )
</template>
