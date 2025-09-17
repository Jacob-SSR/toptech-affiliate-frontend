<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50"
  >
    <div class="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
      <h1 class="text-xl font-bold mb-4">โปรดยืนยันอีเมล</h1>
      <p class="mb-4">
        เราได้ส่งลิงก์ยืนยันไปที่:
        <span class="font-semibold">{{ email }}</span>
      </p>

      <button
        @click="resendVerification"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        ส่งอีเมลยืนยันใหม่
      </button>

      <button
        @click="checkVerified"
        class="w-full bg-green-600 text-white py-2 rounded mt-3 hover:bg-green-700"
      >
        ตรวจสอบอีกครั้ง
      </button>

      <p v-if="message" class="mt-3 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-3 text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sendEmailVerification } from "firebase/auth";

const route = useRoute();
const router = useRouter();
const { $auth } = useNuxtApp();

const email = ref("");
const message = ref("");
const error = ref("");

onMounted(() => {
  email.value =
    route.query.email ||
    $auth.currentUser?.email ||
    "ไม่พบอีเมล (กรุณา login ใหม่)";
});

const resendVerification = async () => {
  try {
    if ($auth.currentUser) {
      await sendEmailVerification($auth.currentUser);
      message.value = "ส่งอีเมลยืนยันใหม่เรียบร้อยแล้ว";
    } else {
      error.value = "กรุณาเข้าสู่ระบบใหม่เพื่อส่งอีเมลยืนยัน";
    }
  } catch (err) {
    error.value = err.message;
  }
};

const checkVerified = async () => {
  try {
    if ($auth.currentUser) {
      await $auth.currentUser.reload();
      if ($auth.currentUser.emailVerified) {
        message.value = "ยืนยันอีเมลเรียบร้อยแล้ว กำลังพาไป Login...";
        setTimeout(() => router.push("/affiliates/login"), 2000);
      } else {
        error.value = "ยังไม่ได้ยืนยันอีเมล";
      }
    } else {
      error.value = "กรุณาเข้าสู่ระบบใหม่";
    }
  } catch (err) {
    error.value = err.message;
  }
};
</script>
