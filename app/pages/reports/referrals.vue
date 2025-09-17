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
          รายงานการแนะนำ
        </h1>
      </div>

      <!-- Filters -->
      <div
        class="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-3 md:items-center"
      >
        <div class="flex-1">
          <input
            v-model="search"
            type="text"
            placeholder="🔍 ค้นหาอีเมล, ชื่อ หรือโค้ด..."
            class="w-full border rounded p-2 text-sm"
          />
        </div>
        <select v-model="filterStatus" class="border rounded p-2 text-sm">
          <option value="">ทุกสถานะ</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full text-sm border-collapse">
          <thead class="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th class="py-3 px-6">วันที่สมัคร</th>
              <th class="py-3 px-6">ชื่อ</th>
              <th class="py-3 px-6 min-w-[200px]">อีเมล</th>
              <th class="py-3 px-6 min-w-[150px]">โค้ด</th>
              <th class="py-3 px-6">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in filteredData"
              :key="idx"
              class="border-t hover:bg-gray-50"
            >
              <td class="py-3 px-6">
                {{ new Date(item.registeredAt).toLocaleDateString("th-TH") }}
              </td>
              <td class="py-3 px-6">{{ item.name }}</td>
              <td class="py-3 px-6">{{ item.email }}</td>
              <td class="py-3 px-6 font-mono">{{ item.code }}</td>
              <td class="py-3 px-6">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': item.status === 'APPROVED',
                    'bg-yellow-100 text-yellow-700': item.status === 'PENDING',
                    'bg-red-100 text-red-700': item.status === 'REJECTED',
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="5" class="text-center text-gray-500 py-6">
                ไม่พบข้อมูล
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Error / Loading -->
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      <p v-if="loading" class="text-gray-500 mt-4">กำลังโหลดข้อมูล...</p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Sidebar from "~/components/Sidebar.vue";

const sidebarOpen = ref(false);

const referrals = ref([]);
const search = ref("");
const filterStatus = ref("");
const error = ref("");
const loading = ref(false);

// โหลดข้อมูลจริงจาก backend
onMounted(async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("affiliateToken");
    const res = await axios.get(
      "http://localhost:8000/api/affiliate/referrals",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    referrals.value = res.data.referrals;
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  } finally {
    loading.value = false;
  }
});

// ฟิลเตอร์ข้อมูล
const filteredData = computed(() => {
  return referrals.value.filter((item) => {
    const matchesSearch =
      item.email.toLowerCase().includes(search.value.toLowerCase()) ||
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.code.toLowerCase().includes(search.value.toLowerCase());

    const matchesStatus =
      !filterStatus.value || item.status === filterStatus.value;

    return matchesSearch && matchesStatus;
  });
});
</script>
