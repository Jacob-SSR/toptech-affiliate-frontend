<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="flex-1 p-4 md:p-6 overflow-y-auto">
      <!-- Mobile toggle button -->
      <button
        class="md:hidden mb-4 bg-gray-900 text-white px-3 py-2 rounded"
        @click="sidebarOpen = !sidebarOpen"
      >
        ☰ เมนู
      </button>

      <!-- Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
      >
        <h1 class="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          การสร้างลิงก์ Affiliate
        </h1>
      </div>

      <!-- Content -->
      <div class="max-w-xl bg-white p-4 md:p-6 rounded shadow mx-auto w-full">
        <!-- Current Link -->
        <div class="mb-4">
          <label class="block mb-2 font-medium text-sm md:text-base">
            ลิงก์ปัจจุบัน
          </label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input
              v-model="currentLink"
              type="text"
              readonly
              class="flex-1 border rounded p-2 bg-gray-100 text-sm"
            />
            <button
              @click="copyLink"
              class="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 text-sm"
            >
              Copy
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            แก้ไขล่าสุด:
            {{ lastUpdate ? new Date(lastUpdate).toLocaleDateString() : "-" }}
          </p>
        </div>

        <!-- New Code -->
        <div class="mb-4">
          <label class="block mb-2 font-medium text-sm md:text-base">
            รหัสใหม่ (จะแทนที่ตรง <code>?via=CODE</code>)
          </label>
          <div class="flex">
            <span
              class="px-2 py-2 bg-gray-100 border border-r-0 rounded-l text-gray-600 text-sm"
            >
              https://paylater.toptechplaza.com?via=
            </span>
            <input
              v-model="newCode"
              type="text"
              placeholder="your-new-code"
              class="flex-1 border rounded-r p-2"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">
            * สามารถแก้ได้เพียง 1 ครั้งต่อ 3 เดือน
          </p>
        </div>

        <!-- Update Button -->
        <button
          @click="updateLink"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          อัปเดตรหัส
        </button>

        <!-- Messages -->
        <p v-if="error" class="text-red-500 mt-3 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-500 mt-3 text-sm">{{ success }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Sidebar from "~/components/Sidebar.vue";

const sidebarOpen = ref(false);

const currentLink = ref("");
const lastUpdate = ref(null);
const newCode = ref("");
const error = ref("");
const success = ref("");

onMounted(async () => {
  try {
    const token = localStorage.getItem("affiliateToken");
    const res = await axios.get(
      "http://localhost:8000/api/affiliate/dashboard",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    currentLink.value = res.data.affiliateLink;
    lastUpdate.value = res.data.lastLinkUpdate;
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  }
});

const updateLink = async () => {
  error.value = "";
  success.value = "";

  if (!newCode.value) {
    error.value = "กรุณากรอกรหัสใหม่";
    return;
  }
  if (newCode.value.length < 4) {
    error.value = "รหัสต้องมีอย่างน้อย 4 ตัวอักษร";
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(newCode.value)) {
    error.value = "รหัสต้องเป็นตัวอักษร/ตัวเลข/ขีดกลาง/ขีดล่างเท่านั้น";
    return;
  }

  try {
    const token = localStorage.getItem("affiliateToken");
    const res = await axios.put(
      "http://localhost:8000/api/affiliate/update-link",
      { newCode: newCode.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    currentLink.value = res.data.affiliateLink;
    lastUpdate.value = res.data.lastLinkUpdate;
    success.value = "อัปเดตรหัสเรียบร้อยแล้ว";
    newCode.value = "";
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  }
};

const copyLink = () => {
  navigator.clipboard.writeText(currentLink.value);
  alert("คัดลอกลิงก์เรียบร้อยแล้ว!");
};
</script>
