<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { EnergyData } from '@/services/energyService'

interface ForecastData {
  date: string
  predicted: number
  confidence: number
}

const props = defineProps<{ 
  historical: EnergyData[]
  forecast: ForecastData[]
}>()

const chartData = computed(() => {
  const lastSevenDays = props.historical.slice(-7)
  const historicalValues = lastSevenDays.map(d => ({ x: d.date, y: d.kWh }))
  
  const forecastValues = props.forecast.map(f => ({ x: f.date, y: f.predicted }))
  
  return {
    historical: historicalValues,
    forecast: forecastValues,
    allDates: [...lastSevenDays.map(d => d.date), ...props.forecast.map(f => f.date)]
  }
})

const series = computed(() => [
  {
    name: 'Historical Usage',
    data: chartData.value.historical
  },
  {
    name: 'Predicted Usage',
    data: [
      // Connecting last historical point to forecast
      chartData.value.historical[chartData.value.historical.length - 1],
      ...chartData.value.forecast
    ]
  }
])

const options = computed(() => ({
  chart: { 
    type: 'line', 
    height: 350,
    toolbar: { show: false }
  },
  stroke: {
    width: [3, 3],
    curve: 'smooth',
    dashArray: [0, 5]
  },
  colors: ['#3b82f6', '#0b8960'],
  theme: {
  monochrome: { enabled: false }
},
markers: {
  colors: ['#3b82f6', '#0b8960']
},
  xaxis: { 
    type: 'category',
    categories: chartData.value.allDates,
    title: { text: 'Date' },
    labels: {
      formatter: (val: string) => {
        const date = new Date(val)
        return `${date.getDate()}/${date.getMonth() + 1}`
      }
    }
  },
  yaxis: {
    title: { text: 'Energy (kWh)' },
    labels: {
      formatter: (val: number) => val.toFixed(0)
    }
  },
  title: { 
    text: '3-Day Energy Consumption Forecast', 
    align: 'left',
    style: { fontSize: '16px', fontWeight: 600 }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val: number) => `${val.toFixed(2)} kWh`
    }
  },
  annotations: {
    xaxis: props.forecast.length > 0 ? [{
      x: props.forecast[0].date,
      borderColor: '#9333ea',
      strokeDashArray: 0,
      label: {
        text: 'Forecast Start',
        style: {
          color: '#fff',
          background: '#9333ea'
        }
      }
    }] : []
  },
  fill: {
    type: 'solid',
    opacity: [1, 1]
  }
}))
</script>

<template>
  <div>
    <apexchart type="line" height="350" :options="options" :series="series" />
    <div class="mt-4 grid grid-cols-3 gap-2">
      <div 
        v-for="(day, idx) in forecast" 
        :key="day.date"
        class="p-3 bg-green-50 rounded-lg border border-green-200 text-center"
      >
        <p class="text-xs text-gray-600 mb-1">Day {{ idx + 1 }}</p>
        <p class="text-lg font-bold text-gray-900">{{ day.predicted.toFixed(0) }} kWh</p>
        <p class="text-xs text-green-600">{{ (day.confidence * 100).toFixed(0) }}% confidence</p>
      </div>
    </div>
  </div>
</template>