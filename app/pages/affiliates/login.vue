<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
    <div class="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
      <h1 class="text-xl font-bold mb-4 text-center">Affiliate Login</h1>

      <form @submit.prevent="login">
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

        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>

      <p class="mt-4 text-sm text-center">
        ยังไม่มีบัญชี? 
        <NuxtLink
          to="/affiliates/register"
          class="text-blue-500 hover:underline"
        >
          สมัครสมาชิก
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const { $auth } = useNuxtApp();

const config = useRuntimeConfig();
const backendUrl = config.public.backendUrl;

const login = async () => {
  error.value = "";

  try {
    const userCredential = await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      return router.push({
        path: "/verify-email",
        query: { email: user.email },
      });
    }

    const res = await axios.post(`${backendUrl}/api/affiliate/login`, {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem("affiliateToken", res.data.token);

    router.push("/affiliates/dashboard");
  } catch (err) {
    if (err.code?.startsWith("auth/")) {
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
          error.value = "ไม่พบบัญชีผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง";
          break;
        case "auth/wrong-password":
          error.value = "รหัสผ่านไม่ถูกต้อง";
          break;
        default:
          error.value = `Firebase Error: ${err.message}`;
      }
    } else {
      error.value = err.response?.data?.message || err.message;
    }
  }
};
</script>
