<script lang="ts">
import {
  CandlestickData,
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  Time
} from 'lightweight-charts';
import { defineComponent } from 'vue';

const data: CandlestickData[] = [
  { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 as Time },
  { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 as Time },
  { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 as Time },
  { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 as Time },
  { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 as Time },
  { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 as Time},
  { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 as Time},
  { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 as Time},
  { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 as Time},
  { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 as Time}
];

export default defineComponent({
  name: 'CandlestickPage',
  components: {},

  data() {
    return {
      chart: {} as IChartApi,
      candlestickSeries: {} as ISeriesApi<'Candlestick'>
    };
  },

  mounted() {
    const chartOptions = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' }
      },
      grid: {
        vertLines: {
          color: '#303030'
        },
        horzLines: {
          color: '#303030'
        }
      },
      crosshair: {
        vertLine: {
          color: 'white'
        },
        horzLine: {
          color: 'white'
        }
      }
    };
    this.chart = createChart(
      this.$refs.chartContainer as HTMLElement,
      chartOptions as ChartOptions
    );
    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: 'rgba(0, 255, 0, 1)',
      downColor: 'rgba(255, 0, 0, 1)',
      borderVisible: false,
      wickUpColor: 'rgba(0, 255, 0, 0.5)',
      wickDownColor: 'rgba(255, 0, 0, 0.5)'
    });

    this.candlestickSeries.setData(data);

    this.chart.timeScale().fitContent();
  }
});
</script>

<template lang="pug">
q-page(
  padding
  )
  div.row
    div.row.flex-center(
        style = 'height: 450px; width: 185vh;'
        ref='chartContainer'
    )
    h6.column.flex-center.bg-black.text-white(
        style = 'margin: 0px; writing-mode: vertical-rl; '
    ) Price
  h6.row.flex-center.bg-black.text-white(
        style = 'margin: 0px;'
    ) Time
  q-img(
    src = 'https://www.wikihow.com/images/thumb/e/eb/Read-a-Candlestick-Chart-Step-1.jpg/v4-460px-Read-a-Candlestick-Chart-Step-1.jpg.webp'
    style="max-height: 300px; max-width: 550px;"
  )
</template>
