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
        rowsPerPage: 20
      },
      sellcolumns: [] as unknown[],
      sellrows: [] as {value: number, quantity: number, totalquantity: number}[],
      buycolumns: [] as unknown[],
      buyrows: [] as {value: number, quantity: number, totalquantity: number}[],
      mydata: {
          datasets: [
            {
              data: [] as {x: number, y: number}[],
              showLine: true,
              borderColor: 'rgba(0, 255, 0, 1)',
              backgroundColor: 'rgba(0, 255, 0, 0.5)',
              fill: 'start'
            },
            {
              data: [] as {x: number, y: number}[],
              showLine: true,
              borderColor: 'rgba(255, 0, 0, 1)',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              fill: 'end'
            }
          ]
        },
    };
  },
  async created() {
    this.sellcolumns = [
      {
        name: 'value',
        required: true,
        align: 'left',
        style: 'color: red',
        field: 'value',
        format: (val: number) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'quantity',
        align: 'left',
        field: 'quantity',
        format: (val: number) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: number) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      }
    ];

    this.buycolumns = [
      {
        name: 'value',
        required: true,
        align: 'left',
        style: 'color: green',
        field: 'value',
        format: (val: number) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'quantity',
        align: 'left',
        field: 'quantity',
        format: (val: number) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: number) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      }
    ];

    // Setup data for sell (asks) portion of graph
    this.sellrows = await this.fetchSellData();
    this.mydata.datasets[1].data = this.sellrows.map( (item) => ({x: item.totalquantity, y: item.value}) );
    this.mydata.datasets[1].data.push({x: 0, y: this.sellrows[this.sellrows.length - 1].value});

    // Setup data for buy (bids) portion of graph
    this.buyrows = await this.fetchBuyData();

    // This removes erronous entry of buy value of 9007199254740991
    // Comment this line to get the true format
    this.buyrows = this.buyrows.filter(item => item.value < 10000);


    this.mydata.datasets[0].data = this.buyrows.map( (item) => ({x: item.totalquantity, y: item.value}) );
    this.mydata.datasets[0].data.unshift({x: 0, y: this.buyrows[0].value});
  },

  methods: {
    async fetchSellData(): Promise<{value: number, quantity: number, totalquantity: number}[]> {
      const response = await axios.get('http://localhost:5000/api/orderdata/sell');
      return response.data;
    },

    async fetchBuyData(): Promise<{value: number, quantity: number, totalquantity: number}[]> {
      const response = await axios.get('http://localhost:5000/api/orderdata/buy');
      return response.data;
    },

  }
});
</script>

<template lang="pug">
q-page.fit(
  padding
  )
  div.row.flex-center
    div.col-5(
      style = "height: 60vh"
    )
      ChartComponent.q-pa-md(
        type = 'scatter'
        :data = 'mydata'
      )
    div.col-2.items-center
      q-table(
        :pagination = "pagination"
        :rows = "sellrows"
        :columns = "sellcolumns"
        row-key = "value"
        hide-bottom
        hide-header
        dark
        dense
        square
        flat
      )
      div.row.flex-center.bg-dark
        h5.text-white(
          style = 'margin: 0px'
        ) Show last transaction here
      q-table(
        :pagination = "pagination"
        :rows = "buyrows"
        :columns = "buycolumns"
        row-key = "value"
        hide-bottom
        hide-header
        dark
        dense
        square
        flat
      )
</template>

<style scoped>
.lw-chart {
  height: 1000px;
}
</style>
