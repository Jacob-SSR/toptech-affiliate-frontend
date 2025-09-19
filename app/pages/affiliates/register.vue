<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50"
  >
    <div class="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
      <h1 class="text-xl font-bold mb-4 text-center">Affiliate Register</h1>

      <form @submit.prevent="register">
        <input
          v-model="firstName"
          type="text"
          placeholder="First Name"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          v-model="lastName"
          type="text"
          placeholder="Last Name"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
          :disabled="loading"
        >
          <span v-if="!loading">Register</span>
          <svg
            v-else
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const router = useRouter();
const { $auth } = useNuxtApp();
const config = useRuntimeConfig();
const backendUrl = config.public.backendUrl;

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

const register = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    loading.value = false;
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );

    await sendEmailVerification(userCredential.user);

    await axios.post(`${backendUrl}/api/affiliate/register`, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    router.push("/affiliates/verify-email");
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      error.value = "อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ";
    } else {
      error.value = err.response?.data?.message || err.message;
    }
  } finally {
    loading.value = false;
  }
};
</script>
