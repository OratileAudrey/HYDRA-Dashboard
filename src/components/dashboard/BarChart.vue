<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { EnergyData } from '@/services/energyService'

const props = defineProps<{ data: EnergyData[] }>()

const series = computed(() => [
  { name: 'Energy (kWh)', data: props.data.map(d => d.kWh) }
])

const average = computed(() => {
  if (props.data.length === 0) return 0
  return props.data.reduce((s, d) => s + d.kWh, 0) / props.data.length
})

const options = computed(() => ({
  chart: { 
    type: 'bar', 
    height: 350,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      dataLabels: { position: 'top' },
      colors: {
        ranges: [{
          from: 0,
          to: average.value * 0.8,
          color: '#10b981'
        }, {
          from: average.value * 0.8,
          to: average.value * 1.2,
          color: '#3b82f6'
        }, {
          from: average.value * 1.2,
          to: 1000,
          color: '#ef4444'
        }]
      }
    }
  },
  xaxis: { 
    categories: props.data.map(d => d.date.split('-')[2]),
    title: { text: 'Day of Month' }
  },
  yaxis: {
    title: { text: 'Energy (kWh)' }
  },
  title: { 
    text: 'Daily Energy Consumption Comparison', 
    align: 'left' 
  },
  dataLabels: {
    enabled: false
  },
  annotations: {
    yaxis: [{
      y: average.value,
      borderColor: '#9333ea',
      strokeDashArray: 5,
      label: {
        text: `Average: ${average.value.toFixed(1)} kWh`,
        style: {
          color: '#fff',
          background: '#9333ea'
        }
      }
    }]
  }
}))
</script>

<template>
  <apexchart type="bar" height="350" :options="options" :series="series" />
</template>