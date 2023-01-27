<script lang="ts">
import axios from 'axios';
import {
  CandlestickData,
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CandlestickPage',
  components: {},

  data() {
    return {
      chart: {} as IChartApi,
      candlestickSeries: {} as ISeriesApi<'Candlestick'>,
      timeDivision: 'Minute',
      timeDivisionList: ['Minute', 'Half-hour', 'Hour', 'Day']
    };
  },

  async mounted() {
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
      },
      timeScale: {
            timeVisible: true
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
    this.candlestickSeries.setData(await this.fetchCandlestickData());
    this.chart.timeScale().fitContent();
  },

  methods: {
    async fetchCandlestickData(): Promise<CandlestickData[]> {
      let string = '';
      switch (this.timeDivision) {
        case 'Minute':
          string = 'minute';
          break;
        case 'Half-hour':
          string = 'halfhour';
          break;
        case 'Hour':
          string = 'hour';
          break;
        case 'Day':
          string = 'day';
      }
      const response = await axios.get(
        `http://localhost:5000/api/candlestickdata/transactions/${string}`
      );
      return response.data as CandlestickData[];
    },

    async getNewCandlestickData() {
      this.chart.removeSeries(this.candlestickSeries);

      this.candlestickSeries = this.chart.addCandlestickSeries({
        upColor: 'rgba(0, 255, 0, 1)',
        downColor: 'rgba(255, 0, 0, 1)',
        borderVisible: false,
        wickUpColor: 'rgba(0, 255, 0, 0.5)',
        wickDownColor: 'rgba(255, 0, 0, 0.5)'
      });
      this.candlestickSeries.setData(await this.fetchCandlestickData());
      this.chart.timeScale().fitContent();
    }
  }
});
</script>

<template lang="pug">
q-page(
  padding
  )
  div.row.flex-center
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
  div.row.justify-around
    q-img(
      src = 'https://www.wikihow.com/images/thumb/e/eb/Read-a-Candlestick-Chart-Step-1.jpg/v4-460px-Read-a-Candlestick-Chart-Step-1.jpg.webp'
      style="max-height: 300px; max-width: 550px;"
    )
    q-select.col-2(
      bg-color = "white"
      filled
      v-model = 'timeDivision'
      :options = 'timeDivisionList'
      label = 'Time division'
      @update:model-value = 'getNewCandlestickData();'
    )
</template>
