<script lang="ts">
import { defineComponent } from 'vue';
import Chart from 'chart.js/auto';
import { ChartItem, ChartTypeRegistry } from 'chart.js';

export default defineComponent({
  name: 'ChartComponent',

  props: {
    type: {
      type: String,
      required: true
    },
    data: Object,
    options: {
      type: Object,
      default() {
        return {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
              }
          },
          elements: {
            point: {
              pointStyle: false
            }
          },
          scales: {
            x: {
              border: {
                color: '#808080'
              },
              grid: {
                color: '#606060'
              },
              reverse: true,
              min: 0,
              ticks: {
                color: 'white'
              }
            },
            y: {
              border: {
                color: '#808080'
              },
              grid: {
                color: '#606060'
              },
              ticks: {
                color: 'white'
              }
            },
          }
        }
      }
    }
  },

  mounted() {
    this.chartConstructor(this.type, this.data, this.options);
  },

  methods: {
    chartConstructor(chartType: string, chartData: any, chartOptions: any) {
      const chartElement = document.getElementById('chartid');
      if (chartElement != null) {
        const chart = new Chart(chartElement as ChartItem, {
          type: chartType as keyof ChartTypeRegistry,
          data: chartData,
          options: chartOptions
        });
      }
    }
  }
});
</script>

<template lang="pug">
canvas(
      id = 'chartid'
    )
</template>
