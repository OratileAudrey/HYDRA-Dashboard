<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { WeatherData } from '@/services/weatherService'

interface MovingAverageData {
  date: string
  value: number
  actual: number
}

const props = defineProps<{ 
  data: MovingAverageData[]
  weather: WeatherData[]
}>()

const series = computed(() => [
  { 
    name: 'Actual Usage', 
    data: props.data.map(d => d.actual),
    type: 'line'
  },
  { 
    name: '7-Day Moving Average', 
    data: props.data.map(d => d.value),
    type: 'line'
  },
  {
    name: 'Temperature (°C)',
    data: props.data.map(d => {
      const weather = props.weather.find(w => w.date === d.date)
      return weather ? weather.temp : null
    }),
    type: 'line'
  }
])

const options = computed(() => ({
  chart: { 
    type: 'line', 
    height: 400,
    zoom: { enabled: true },
    toolbar: { show: false }
  },
  stroke: {
    width: [2, 3, 2],
    curve: ['straight', 'smooth', 'smooth'],
    dashArray: [0, 0, 5]
  },
  colors: ['#3b82f6', '#8b5cf6', '#f59e0b'],
  xaxis: { 
    categories: props.data.map(d => d.date),
    title: { text: 'Date' },
    labels: {
      rotate: -45,
      formatter: (val: string) => {
        const date = new Date(val)
        return `${date.getDate()}/${date.getMonth() + 1}`
      }
    }
  },
  yaxis: [
    {
      title: { text: 'Energy (kWh)', style: { color: '#3b82f6' } },
      labels: {
        formatter: (val: number) => val.toFixed(0),
        style: { colors: '#3b82f6' }
      }
    },
    {
      seriesName: '7-Day Moving Average',
      show: false
    },
    {
      opposite: true,
      title: { text: 'Temperature (°C)', style: { color: '#f59e0b' } },
      labels: {
        formatter: (val: number) => val ? val.toFixed(0) : '',
        style: { colors: '#f59e0b' }
      }
    }
  ],
  title: { 
    text: '7-Day Moving Average with Weather Correlation', 
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
      formatter: (val: number, opts: any) => {
        if (opts.seriesIndex === 2) {
          return val ? `${val.toFixed(1)}°C` : 'N/A'
        }
        return `${val.toFixed(2)} kWh`
      }
    }
  },
  markers: {
    size: [0, 0, 3],
    colors: ['#3b82f6', '#8b5cf6', '#f59e0b']
  }
}))
</script>

<template>
  <div>
    <apexchart type="line" height="400" :options="options" :series="series" />
    <div class="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
      <p class="text-sm text-purple-800">
        <strong>Analysis:</strong> The 7-day moving average smooths out daily fluctuations to reveal underlying trends. 
        Temperature overlay helps identify weather-driven consumption patterns.
      </p>
    </div>
  </div>
</template>