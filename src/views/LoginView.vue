<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import { loginUser } from '@/services/auth'

const router = useRouter()
const error = ref('')
const token = ref('')

const handleLogin = async (data: { username: string; password: string }) => {
  if (!data.username || !data.password) {
    error.value = 'Both fields are required.'
    return
  }

  error.value = ''
  try {
    const result = await loginUser(data.username, data.password)
    token.value = result.access_token
    localStorage.setItem('access_token', token.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.error_description || err.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-6 tracking-tight">
        Welcome Back
      </h1>
      <p class="text-sm text-gray-500 text-center mb-8">
        Please sign in to continue
      </p>

      <LoginForm @login="handleLogin" />

      <p v-if="error" class="text-red-600 text-sm mt-4 text-center font-medium">
        {{ error }}
      </p>
      <p v-if="token" class="text-green-600 text-sm mt-4 text-center break-all">
        Token: {{ token }}
      </p>

      <p class="text-xs text-gray-400 text-center mt-8">
        © 2025 HYDRA — All rights reserved
      </p>
    </div>
  </div>
</template>
