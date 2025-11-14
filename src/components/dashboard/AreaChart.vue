<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { EnergyData } from '@/services/energyService'

const props = defineProps<{ data: EnergyData[] }>()

const series = computed(() => {
  let cumulative = 0
  const cumulativeData = props.data.map(d => {
    cumulative += d.kWh
    return cumulative
  })
  
  return [
    { name: 'Cumulative Energy (kWh)', data: cumulativeData }
  ]
})

const options = computed(() => ({
  chart: { 
    type: 'area', 
    height: 350,
    zoom: { enabled: true },
    toolbar: { show: false }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100]
    }
  },
  xaxis: { 
    categories: props.data.map(d => d.date),
    title: { text: 'Date' }
  },
  yaxis: {
    title: { text: 'Cumulative Energy (kWh)' },
    labels: {
      formatter: (val: number) => val.toFixed(0)
    }
  },
  colors: ['#8b5cf6'],
  title: { 
    text: 'Cumulative Energy Consumption', 
    align: 'left' 
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)} kWh`
    }
  }
}))
</script>

<template>
  <apexchart type="area" height="350" :options="options" :series="series" />
</template>