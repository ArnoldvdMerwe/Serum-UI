<script lang="ts">
import axios from 'axios';
import {
  CandlestickData,
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  LineData
} from 'lightweight-charts';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CandlestickPage',
  components: {},

  data() {
    return {
      lineChart: {} as IChartApi,
      lineSeries: {} as ISeriesApi<'Line'>,
      candlestickChart: {} as IChartApi,
      candlestickSeries: {} as ISeriesApi<'Candlestick'>,
      timeDivision: 'Month',
      timeDivisionList: ['Half-hour', 'Hour', 'Day', 'Month'],
      id: 0,
      idList: [] as number[]
    };
  },

  async mounted() {
    this.idList = await this.fetchIdList();
    this.id = this.idList[0];

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
        timeVisible: true,
        minBarSpacing: 0
      }
    };
    this.lineChart = createChart(
      this.$refs.lineChartContainer as HTMLElement,
      chartOptions as ChartOptions
    );
    this.lineSeries = this.lineChart.addLineSeries({ color: '#c2117b' });
    this.lineSeries.setData(await this.fetchLineGraph());

    this.lineChart.timeScale().fitContent();

    this.candlestickChart = createChart(
      this.$refs.candlestickChartContainer as HTMLElement,
      chartOptions as ChartOptions
    );
    this.candlestickSeries = this.candlestickChart.addCandlestickSeries({
      upColor: 'rgba(0, 255, 0, 1)',
      downColor: 'rgba(255, 0, 0, 1)',
      borderVisible: false,
      wickUpColor: 'rgba(0, 255, 0, 0.5)',
      wickDownColor: 'rgba(255, 0, 0, 0.5)'
    });

    this.candlestickSeries.setData(await this.fetchCandlestickData());
    this.candlestickChart.timeScale().fitContent();
  },

  methods: {
    async fetchIdList(): Promise<number[]> {
      const response = await axios.get(
        'http://localhost:5000/api/linedata/idlist'
      );
      return response.data;
    },

    async fetchLineGraph(): Promise<LineData[]> {
      const response = await axios.get(
        `http://localhost:5000/api/linedata/${this.id}`
      );
      return response.data[0].linedata as LineData[];
    },

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
          break;
        case 'Month':
          string = 'month';
          break;
      }
      const response = await axios.get(
        `http://localhost:5000/api/candlestickdata/transactions/${this.id}/${string}`
      );
      return response.data as CandlestickData[];
    },

    async getNewCandlestickData() {
      this.candlestickChart.removeSeries(this.candlestickSeries);
      this.candlestickSeries = this.candlestickChart.addCandlestickSeries({
        upColor: 'rgba(0, 255, 0, 1)',
        downColor: 'rgba(255, 0, 0, 1)',
        borderVisible: false,
        wickUpColor: 'rgba(0, 255, 0, 0.5)',
        wickDownColor: 'rgba(255, 0, 0, 0.5)'
      });
      this.candlestickSeries.setData(await this.fetchCandlestickData());
      this.candlestickChart.timeScale().fitContent();
    },

    async getNewLineData() {
      this.lineChart.removeSeries(this.lineSeries);
      this.lineSeries = this.lineChart.addLineSeries({ color: '#c2117b' });
      this.lineSeries.setData(await this.fetchLineGraph());
      this.lineChart.timeScale().fitContent();
      this.getNewCandlestickData();
    }
  }
});
</script>

<template lang="pug">
q-page(
  padding
  )
  h5.row.flex-center.bg-black.text-white Price over time - Line graph
  div.row.flex-center
    div.row.flex-center(
        style = 'height: 450px; width: 185vh;'
        ref='lineChartContainer'
    )
    h6.column.flex-center.bg-black.text-white(
      style = 'margin: 0px; writing-mode: vertical-rl;'
    ) Price
  h6.row.flex-center.bg-black.text-white(
      style = 'margin: 0px;'
  ) Time
  h5.row.flex-center.bg-black.text-white Price over time - Candlestick chart
  div.row.flex-center
    div.row.flex-center(
      style = 'height: 450px; width: 185vh;'
      ref='candlestickChartContainer'
    )
    h6.column.flex-center.bg-black.text-white(
      style = 'margin: 0px; writing-mode: vertical-rl;'

    ) Price
  h6.row.flex-center.bg-black.text-white(
      style = 'margin: 0px;'
  ) Time
  div.row.justify-around
    q-select.col-2(
      bg-color = "white"
      filled
      v-model = 'id'
      :options = 'idList'
      label = 'Line data'
      @update:model-value = 'getNewLineData();'
    )
    q-select.col-2(
      bg-color = "white"
      filled
      v-model = 'timeDivision'
      :options = 'timeDivisionList'
      label = 'Time division for candlestick chart'
      @update:model-value = 'getNewCandlestickData();'
    )
</template>
