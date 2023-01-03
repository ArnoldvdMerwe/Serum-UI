<script lang="ts">
import { defineComponent } from 'vue';
import {
  ChartOptions,
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
} from 'lightweight-charts';
import axios from 'axios';

let chart: IChartApi | null;
let lineSeries: ISeriesApi<'Line'> | undefined;


export default defineComponent({
    name: 'MeterDataPage',

    data() {
        return{
        id: null,
        idList: [] as string[]
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
            timeVisible: true
        }
        };
        chart = createChart(
        this.$refs.chartContainer as HTMLElement,
        chartOptions as ChartOptions
        );
        lineSeries = chart.addLineSeries({ color: '#154c79' });
    },

    methods: {
        async fetchMeterData(): Promise<LineData[]> {
            const response = await axios.get(`http://localhost:5000/api/meterdata/${this.id}`);
            return response.data as LineData[];
        },

        // Fetch sample data from dropdown list and display it
        async fetchNewMeterData() {
            chart?.removeSeries(lineSeries as ISeriesApi<'Line'>);

            lineSeries = chart?.addLineSeries({ color: '#154c79' });
            if (lineSeries != null) {
                lineSeries.setData(await this.fetchMeterData());
            }
            chart?.timeScale().fitContent();
        },

        async fetchIdList(): Promise<string[]> {
            const response = await axios.get('http://localhost:5000/api/meterdata/ids');
            return response.data;
        },
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

  div.q-pa-sm.row.flex-center
    q-select.col-2(
      bg-color = "white"
      filled
      v-model = 'id'
      :options = 'idList'
      label = 'List of IDs'
    )
    q-btn.q-pa-sm(
      rounded
      label = 'Fetch meter data'
      @click = "fetchNewMeterData"
    )

</template>

<style scoped>
.lw-chart {
  height: 450px;
}
</style>
