<script lang="ts">
import { defineComponent } from 'vue';
import ChartComponent from 'src/components/ChartComponent.vue';


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
  created() {
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
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: number) =>
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      }
    ];

    this.sellrows = [
      {
        value: 11230.8,
        quantity: 0.0375000,
        totalquantity: 0
      },
      {
        value: 11230.7,
        quantity: 2.400000,
        totalquantity: 0
      },
      {
        value: 11229.7,
        quantity: 0.17081920,
        totalquantity: 0
      },
      {
        value: 11229.5,
        quantity: 0.48295885,
        totalquantity: 0
      },
      {
        value: 11229.4,
        quantity: 0.66821407,
        totalquantity: 0
      },
      {
        value: 11229.2,
        quantity: 2.03350426,
        totalquantity: 0
      },
      {
        value: 11225.3,
        quantity: 1.653351,
        totalquantity: 0
      },
      {
        value: 11225.0,
        quantity: 6.49693349,
        totalquantity: 0
      },
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
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: number) =>
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      }
    ];

    this.buyrows = [
      {
        value: 11224.9,
        quantity: 9.62905182,
        totalquantity: 0
      },
      {
        value: 11224.8,
        quantity: 0.66828528,
        totalquantity: 0
      },
      {
        value: 11224.2,
        quantity: 0.531,
        totalquantity: 0
      },
      {
        value: 11223.9,
        quantity: 0.66834654,
        totalquantity: 0
      },
      {
        value: 11223.2,
        quantity: 1.09718172,
        totalquantity: 0
      },
      {
        value: 11223.1,
        quantity: 0.89075558,
        totalquantity: 0
      },
      {
        value: 11223.0,
        quantity: 6.2130000,
        totalquantity: 0
      },
      {
        value: 11222.7,
        quantity: 0.89096723,
        totalquantity: 0
      }
    ];

    // Setup data for buy (bids) portion of graph
    this.calculateTotalQuantity(this.buyrows, true);
    this.mydata.datasets[0].data = this.buyrows.map( (item) => ({x: item.totalquantity, y: item.value}) );
    this.mydata.datasets[0].data.unshift({x: 0, y: this.buyrows[0].value});

    // Setup data for sell (asks) portion of graph
    this.calculateTotalQuantity(this.sellrows, false);
    this.mydata.datasets[1].data = this.sellrows.map( (item) => ({x: item.totalquantity, y: item.value}) );
    this.mydata.datasets[1].data.push({x: 0, y: this.sellrows[this.sellrows.length - 1].value});

  },

  methods: {
    calculateTotalQuantity(array: {value: number, quantity: number, totalquantity: number}[], forward: boolean) {
      let temp = 0;
      if (forward) {
      array.forEach((value) => {
        temp = temp + value.quantity;
        value.totalquantity = temp;
      });
      }
      else {
        for(let i = 1; i <= array.length; i++)
        {
          temp = temp + array[array.length - i].quantity;
          array[array.length-i].totalquantity = temp;
        }
      }
    }

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
        ) 11224.9 USD
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
