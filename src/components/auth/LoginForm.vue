<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits<{ (e: 'login', payload: { username: string; password: string }): void }>()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const submit = () => {
  emit('login', { username: username.value, password: password.value })
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4">
    <div>
      <label class="block mb-1 font-medium">Username</label>
      <input
        v-model="username"
        type="text"
        placeholder="Enter username"
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="block mb-1 font-medium">Password</label>
      <div class="relative">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter password"
          class="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M10.73 5.08A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.27 2.68M6.1 6.1C4.225 7.386 2.843 9.507 2.458 12c1.274 4.057 5.064 7 9.542 7a9.956 9.956 0 004.12-.88"
            />
          </svg>
        </button>
      </div>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
    >
      Login
    </button>
  </form>
</template>
