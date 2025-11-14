<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  from: string
  to: string
}>()

const emit = defineEmits<{
  (e: 'update', payload: { from: string; to: string }): void
}>()

const fromDate = ref(props.from)
const toDate = ref(props.to)
const showPicker = ref(false)
const pickerRef = ref<HTMLElement | null>(null)

const applyDates = () => {
  if (fromDate.value && toDate.value) {
    emit('update', { from: fromDate.value, to: toDate.value })
    showPicker.value = false
  }
}

const setQuickRange = (days: number) => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  
  fromDate.value = start.toISOString().split('T')[0]
  toDate.value = end.toISOString().split('T')[0]
  applyDates()
}

const handleClickOutside = (event: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    showPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

watch(() => props.from, (val) => { fromDate.value = val })
watch(() => props.to, (val) => { toDate.value = val })
</script>

<template>
  <div class="relative" ref="pickerRef">
    <button
      @click="showPicker = !showPicker"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="hidden sm:inline">{{ from }} - {{ to }}</span>
      <span class="sm:hidden">Date Range</span>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="showPicker"
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
    >
      <div class="p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Select Date Range</h3>
        
        <!-- Quick ranges -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <button
            @click="setQuickRange(7)"
            class="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Last 7 Days
          </button>
          <button
            @click="setQuickRange(30)"
            class="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Last 30 Days
          </button>
          <button
            @click="setQuickRange(90)"
            class="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Last 90 Days
          </button>
        </div>

        <!-- Date inputs -->
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">From Date</label>
            <input
              v-model="fromDate"
              type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">To Date</label>
            <input
              v-model="toDate"
              type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="showPicker = false"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="applyDates"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>