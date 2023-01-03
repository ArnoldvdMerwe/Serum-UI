<script lang="ts">
import { defineComponent } from 'vue';
import {
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  LineData
} from 'lightweight-charts';

let chart: IChartApi | null;
let lineSeries: ISeriesApi<'Line'> | undefined;

export default defineComponent({
  name: 'MeterDataPage',

  data() {
    return {
      sellcolumns: [] as unknown[],
      sellrows: [] as unknown[],
      buycolumns: [] as unknown[],
      buyrows: [] as unknown[]
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
        format: (val: any, row: any) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'quantity',
        align: 'left',
        field: 'quantity',
        format: (val: any, row: any) =>
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: any, row: any) =>
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      }
    ];

    this.sellrows = [
      {
        value: 11229.4,
        quantity: 0.66821407,
        totalquantity: 10.85200282
      },
      {
        value: 11229.2,
        quantity: 2.03350426,
        totalquantity: 10.18378875
      },
      {
        value: 11225.3,
        quantity: 1.653351,
        totalquantity: 8.15028449
      },
      {
        value: 11225.0,
        quantity: 6.39693349,
        totalquantity: 6.39693349
      }
    ];
    this.buycolumns = [
      {
        name: 'value',
        required: true,
        align: 'left',
        style: 'color: green',
        field: 'value',
        format: (val: any, row: any) =>
          `${(Math.round(val * 100) / 100).toFixed(1)}`
      },
      {
        name: 'quantity',
        align: 'left',
        field: 'quantity',
        format: (val: any, row: any) =>
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      },
      {
        name: 'totalquantity',
        align: 'left',
        field: 'totalquantity',
        format: (val: any, row: any) =>
          `${(Math.round(val * 100000000) / 100000000).toFixed(8)}`
      }
    ];

    this.buyrows = [
      {
        value: 11224.9,
        quantity: 9.62905182,
        totalquantity: 9.62905182
      },
      {
        value: 11224.8,
        quantity: 0.66828528,
        totalquantity: 10.2973371
      },
      {
        value: 11224.2,
        quantity: 0.531,
        totalquantity: 10.8283371
      },
      {
        value: 11223.9,
        quantity: 0.66834654,
        totalquantity: 11.49668364
      }
    ];
  },

  async mounted() {
    const chartOptions = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' }
      },
      timeScale: {
        timeVisible: true
      }
    };
    chart = createChart(
      this.$refs.chartContainer as HTMLElement,
      chartOptions as ChartOptions
    );
    lineSeries = chart.addLineSeries({ color: '#154c79' });
  }
});
</script>

<template lang="pug">
q-page.fit(
  padding
  )
  div.row.flex-center
    div.col-2.flex-center
        q-table(
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
        div.row.flex-center(
            class = 'bg-dark'
        )
            text-h3(
                class = 'text-white'
            ) 11224.9 USD
        q-table(
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
  height: 450px;
}
</style>
