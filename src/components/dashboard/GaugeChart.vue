<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { EnergyData } from '@/services/energyService'

const props = defineProps<{ 
  data: EnergyData[]
  target?: number
}>()

const totalUsage = computed(() => 
  props.data.reduce((sum, d) => sum + d.kWh, 0)
)

const targetValue = computed(() => props.target || totalUsage.value * 1.2)

const percentage = computed(() => 
  Math.min((totalUsage.value / targetValue.value) * 100, 100)
)

const series = computed(() => [Math.round(percentage.value)])

const options = computed(() => ({
  chart: {
    type: 'radialBar',
    height: 350
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: '70%',
        background: '#fff',
      },
      track: {
        background: '#e5e7eb',
        strokeWidth: '100%',
        margin: 5
      },
      dataLabels: {
        show: true,
        name: {
          offsetY: -10,
          show: true,
          color: '#6b7280',
          fontSize: '14px'
        },
        value: {
          formatter: () => `${totalUsage.value.toFixed(0)} kWh`,
          color: '#111827',
          fontSize: '30px',
          fontWeight: 'bold',
          show: true,
          offsetY: 5
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#10b981'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
      colorStops: [
        { offset: 0, color: '#ef4444', opacity: 1 },
        { offset: 50, color: '#f59e0b', opacity: 1 },
        { offset: 100, color: '#10b981', opacity: 1 }
      ]
    }
  },
  stroke: {
    lineCap: 'round'
  },
  labels: ['Monthly Usage']
}))
</script>

<template>
  <div class="flex flex-col items-center">
    <apexchart type="radialBar" height="350" :options="options" :series="series" />
    <p class="text-sm text-gray-600 mt-2">
      Target: {{ targetValue.toFixed(0) }} kWh
    </p>
  </div>
</template>