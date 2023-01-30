<script lang="ts">
import { defineComponent } from 'vue';
import {
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  Time
} from 'lightweight-charts';
import axios from 'axios';

let chart: IChartApi | null;
let lineSeries: ISeriesApi<'Line'> | undefined;

export default defineComponent({
  name: 'TradingViewPage',

  data() {
    return{
      newId: null,
      id: null,
      idList: [] as number[],
      generatedLineData: [] as LineData[]
    };
  },

  async created() {
    this.idList = await this.fetchIdList();
  },

  async mounted() {
    const chartOptions = {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' }
      },
      timeScale: {
        timeVisible: true,
        minBarSpacing: 0
      }
    };
    chart = createChart(
      this.$refs.chartContainer as HTMLElement,
      chartOptions as ChartOptions
    );
    lineSeries = chart.addLineSeries({ color: '#154c79' });
    lineSeries.setData(await this.fetchSampleData());

    chart.timeScale().fitContent();
  },

  methods: {
    async fetchSampleData(): Promise<LineData[]> {
      const response = await axios.get(`http://localhost:5000/api/linedata/${this.id}`);
      return response.data[0].linedata as LineData[];
    },

    // Fetch sample data from dropdown list and display it
    async fetchNewSampleData() {
      chart?.removeSeries(lineSeries as ISeriesApi<'Line'>);

      lineSeries = chart?.addLineSeries({ color: '#154c79' });
      if (lineSeries != null) {
        lineSeries.setData(await this.fetchSampleData());
      }
      chart?.timeScale().fitContent();
    },

    generateNewSampleData(): LineData[] {
      const randomFactor = 3000 + Math.random() * 3000;
      function samplePoint(i: number) {
        return (
          i *
            (0.0125 +
              Math.cos(i / 2000) * 0.00625 +
              Math.cos(i / 4000) * 0.0125 +
              Math.cos(i / randomFactor) * 0.025 +
              Math.cos(i / 100000) * 0.05) +
          200
        );
      }
      const res = [];
      let date = new Date(Date.UTC(2020, 0, 1, 0, 0, 0, 0));
      const numberOfPoints = 87600;
      for (var i = 0; i < numberOfPoints; ++i) {
        const time = (date.getTime() / 1000) as Time;
        const value: number = samplePoint(i);
        res.push({
          value,
          time
        });

        date.setMinutes(date.getMinutes() + 6);
      }
      this.generatedLineData = res;
      return res;
    },

    // Create new sample data and display it
    displayGenerateSampleData() {
      chart?.removeSeries(lineSeries as ISeriesApi<'Line'>);

      lineSeries = chart?.addLineSeries({ color: '#154c79' });
      if (lineSeries != null) {
        lineSeries.setData(this.generateNewSampleData());
      }
      chart?.timeScale().fitContent();
    },

    async fetchIdList(): Promise<number[]> {
      const response = await axios.get('http://localhost:5000/api/linedata/idlist');
      return response.data;
    },

    async saveNewSampleData() {
      await axios.post('http://localhost:5000/api/linedata/', {
        id: this.newId,
        linedata: this.generatedLineData
      });
      this.idList = await this.fetchIdList();
      this.newId = null;
    },

    async deleteSampleData() {
      await axios.delete(`http://localhost:5000/api/linedata/${this.id}`);
      this.idList = await this.fetchIdList();
      this.id = null;
      this.newId = null;
    }
  }
});
</script>

<template lang="pug">
q-page.fit(
  padding
  )

  div.row.flex-center.lw-chart(
  ref='chartContainer'
  )

  div.row.flex-center
    q-select.col-2(
      bg-color = "white"
      filled
      v-model = 'id'
      :options = 'idList'
      label = 'List of IDs'
    )
    q-btn.q-pa-sm(
      rounded
      label = 'Fetch sample data'
      @click = "fetchNewSampleData"
    )
    q-btn.q-pa-sm(
      rounded
      no-wrap
      label = 'Delete sample data'
      @click = 'deleteSampleData'
    )
    q-btn.col-2.q-pa-sm(
      rounded
      no-wrap
      label = 'Generate new sample data'
      @click = "displayGenerateSampleData"
    )
    q-btn.q-pa-sm(
      rounded
      no-wrap
      label = 'Save sample data'
      @click = 'saveNewSampleData'
    )
    q-input.q-pa-sm(
      filled
      v-model = 'newId'
      color = 'blue'
      bg-color = 'white'
      label = 'New ID'
    )

</template>

<style scoped>
.lw-chart {
  height: 450px;
}
</style>
