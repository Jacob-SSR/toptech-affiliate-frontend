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
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
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

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const success = ref("");

const register = async () => {
  error.value = "";
  success.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );

    await sendEmailVerification(userCredential.user);

    await axios.post("http://localhost:8000/api/affiliate/register", {
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
  }
};
</script>
