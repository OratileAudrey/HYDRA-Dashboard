<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEnergyData, type EnergyData } from '@/services/energyService'
import { getWeatherData, type WeatherData } from '@/services/weatherService'
import BarChart from './BarChart.vue'
import AreaChart from './AreaChart.vue'
import GaugeChart from './GaugeChart.vue'
import MovingAverageChart from './MovingAverageChart.vue'
import ForecastChart from './ForecastChart.vue'
import DateRangePicker from './DateRangePicker.vue'

const router = useRouter()
const energyData = ref<EnergyData[]>([])
const weatherData = ref<WeatherData[]>([])
const totalEnergy = ref(0)
const avgDailyUse = ref(0)
const anomalies = ref(0)
const isLoading = ref(true)
const fromDate = ref('2025-03-01')
const toDate = ref('2025-03-31')

//The 7-day moving average calculation
const movingAverageData = computed(() => {
  const data = energyData.value
  if (data.length < 7) return []
  
  const result: Array<{ date: string; value: number; actual: number }> = []
  
  for (let i = 6; i < data.length; i++) {
    const window = data.slice(i - 6, i + 1)
    const avg = window.reduce((sum, d) => sum + d.kWh, 0) / 7
    result.push({
      date: data[i].date,
      value: avg,
      actual: data[i].kWh
    })
  }
  
  return result
})

// Forecast for next 3 days
const forecastData = computed(() => {
  const data = energyData.value
  if (data.length < 7) return []
  
  // Using last 14 days
  const recentData = data.slice(-14)
  const n = recentData.length
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  recentData.forEach((d, i) => {
    sumX += i
    sumY += d.kWh
    sumXY += i * d.kWh
    sumX2 += i * i
  })
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  // Predicting next 3 days
  const lastDate = new Date(data[data.length - 1].date)
  const forecasts = []
  
  for (let i = 1; i <= 3; i++) {
    const nextDate = new Date(lastDate)
    nextDate.setDate(lastDate.getDate() + i)
    const predicted = slope * (n + i - 1) + intercept
    
    forecasts.push({
      date: nextDate.toISOString().split('T')[0],
      predicted: Math.max(0, predicted),
      confidence: 0.85 - (i * 0.1)
    })
  }
  
  return forecasts
})

// Generating AI insight combining anomalies and weather
const aiInsight = computed(() => {
  if (energyData.value.length === 0 || weatherData.value.length === 0) {
    return 'Loading insights...'
  }
  
  // Finding the largest anomaly
  const anomalyDays = energyData.value
    .map((d, idx) => ({ ...d, idx }))
    .filter(d => d.kWh > avgDailyUse.value * 1.2)
    .sort((a, b) => b.kWh - a.kWh)
  
  if (anomalyDays.length === 0) {
    return 'No significant anomalies detected this period. Energy consumption remains stable.'
  }
  
  const topAnomaly = anomalyDays[0]
  const weather = weatherData.value.find(w => w.date === topAnomaly.date)
  const percentAbove = ((topAnomaly.kWh - avgDailyUse.value) / avgDailyUse.value * 100).toFixed(1)
  
  if (weather) {
    const tempFactor = weather.temp > 30 ? 'high temperatures' : 
                      weather.temp < 15 ? 'cold temperatures' : 'moderate temperatures'
    
    return `On ${topAnomaly.date}, energy usage spiked by ${percentAbove}% (${topAnomaly.kWh.toFixed(0)} kWh vs ${avgDailyUse.value.toFixed(0)} kWh average), coinciding with ${tempFactor} of ${weather.temp}°C and ${weather.condition}. ${weather.temp > 30 ? 'This spike is likely due to increased air conditioning demand.' : weather.temp < 15 ? 'This increase may be attributed to heating requirements.' : 'Weather conditions may have contributed to this usage pattern.'}`
  }
  
  return `On ${topAnomaly.date}, energy usage spiked by ${percentAbove}% above average (${topAnomaly.kWh.toFixed(0)} kWh vs ${avgDailyUse.value.toFixed(0)} kWh). Consider investigating operational activities on this date.`
})

const handleLogout = () => {
  localStorage.removeItem('access_token')
  router.push('/')
}

const handleDateChange = async (dates: { from: string; to: string }) => {
  fromDate.value = dates.from
  toDate.value = dates.to
  await loadData()
}

const loadData = async () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    router.push('/')
    return
  }

  isLoading.value = true
  try {
    // Fetching energy data
    const energy = await getEnergyData(token, fromDate.value, toDate.value)
    energyData.value = energy

    // Fetching weather data for the same period
    const weather = await getWeatherData(fromDate.value, toDate.value)
    weatherData.value = weather

    if (energy.length > 0) {
      totalEnergy.value = energy.reduce((sum, d) => sum + d.kWh, 0)
      avgDailyUse.value = totalEnergy.value / energy.length
      anomalies.value = energy.filter(d => d.kWh > avgDailyUse.value * 1.2).length
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Mobile-optimized navbar -->
    <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Desktop layout (unchanged for large screens) -->
        <div class="hidden md:flex justify-between items-center h-20">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
            </svg>
            <div>
              <h1 class="text-xl font-bold text-gray-900">HYDRA Dashboard</h1>
              <p class="text-xs text-gray-500">Energy Intelligence System</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <DateRangePicker 
              :from="fromDate" 
              :to="toDate" 
              @update="handleDateChange" 
            />
            
            <button
              @click="handleLogout"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <!-- Mobile layout -->
        <div class="md:hidden py-3">
          <!-- Top row: Logo and Logout -->
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-2">
              <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
              </svg>
              <div>
                <h1 class="text-base font-bold text-gray-900">HYDRA Dashboard</h1>
                <p class="text-xs text-gray-500">Energy Intelligence</p>
              </div>
            </div>
            
            <button
              @click="handleLogout"
              class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden xs:inline">Logout</span>
            </button>
          </div>

          <!-- Bottom row: Date Range Picker (full width) -->
          <div class="w-full">
            <DateRangePicker 
              :from="fromDate" 
              :to="toDate" 
              @update="handleDateChange" 
            />
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading energy data...</p>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Energy card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Energy</h2>
              <div class="bg-blue-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ totalEnergy.toFixed(0) }}</p>
            <p class="text-sm text-gray-500 mt-1">kWh consumed</p>
          </div>

          <!-- Average Daily use card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Avg Daily Use</h2>
              <div class="bg-green-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ avgDailyUse.toFixed(1) }}</p>
            <p class="text-sm text-gray-500 mt-1">kWh per day</p>
          </div>

          <!-- Anomalies card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Anomalies</h2>
              <div class="bg-red-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-red-600">{{ anomalies }}</p>
            <p class="text-sm text-gray-500 mt-1">High usage days</p>
          </div>

          <!-- Forecast card -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">3-Day Forecast</h2>
              <div class="bg-purple-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">
              {{ forecastData.length > 0 ? forecastData[0].predicted.toFixed(0) : '-' }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              {{ forecastData.length > 0 ? `kWh tomorrow (${(forecastData[0].confidence * 100).toFixed(0)}% confidence)` : 'kWh predicted' }}
            </p>
          </div>
        </div>

        <!-- AI Insights section -->
        <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-indigo-200">
          <div class="flex items-start gap-4">
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl flex-shrink-0 shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <h2 class="text-lg font-bold text-gray-800">AI-Powered Insight</h2>
                <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">Weather Integrated</span>
              </div>
              <p class="text-gray-700 leading-relaxed">
                {{ aiInsight }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Moving Average chart -->
          <div class="lg:col-span-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <MovingAverageChart :data="movingAverageData" :weather="weatherData" />
          </div>

          <!-- Bar chart -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <BarChart :data="energyData" />
          </div>

          <!-- Area chart -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <AreaChart :data="energyData" />
          </div>

          <!-- Forecast chart -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <ForecastChart :historical="energyData" :forecast="forecastData" />
          </div>

          <!-- Gauge chart -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <GaugeChart :data="energyData" :target="800" />
          </div>
        </div>

        <!-- Weather integration info -->
        <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-blue-800">
              <strong>Weather data integrated:</strong> Temperature and conditions are overlaid on charts and used to enhance insights. 
              This helps identify weather-driven energy consumption patterns.
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="mt-12 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © 2025 HYDRA Energy Intelligence System. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>