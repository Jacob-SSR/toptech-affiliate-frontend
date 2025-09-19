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
          {{ t("overview") }}
        </h1>
        <div class="flex items-center space-x-2 text-sm md:text-base">
          <!-- ปุ่มเปลี่ยนภาษา -->
          <button
            @click="toggleLanguage"
            class="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            {{ language === "th" ? "ภาษาไทย" : "English" }}
          </button>
          <div class="flex items-center space-x-1">
            <span class="font-bold">{{ dashboard?.name }}</span>
            <span class="text-gray-500">Affiliate</span>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500 text-sm">{{ t("commission") }}</p>
          <p class="text-xl font-bold">{{ dashboard?.commission || 0 }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500 text-sm">{{ t("clicks") }}</p>
          <p class="text-xl font-bold">{{ dashboard?.clicks || 0 }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500 text-sm">{{ t("orders") }}</p>
          <p class="text-xl font-bold">{{ dashboard?.orders || 0 }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500 text-sm">{{ t("conversion") }}</p>
          <p class="text-xl font-bold">{{ dashboard?.conversionRate || 0 }}%</p>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500 text-sm">EPC</p>
          <p class="text-xl font-bold">{{ dashboard?.epc || 0 }}</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-bold mb-2 text-sm md:text-base">
            {{ t("referrals") }}
          </h2>
          <client-only>
            <apexchart
              type="line"
              height="200"
              :options="lineOptions"
              :series="lineSeries"
            />
          </client-only>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h2 class="font-bold mb-2 text-sm md:text-base">
            {{ t("details") }}
          </h2>
          <client-only>
            <apexchart
              type="donut"
              height="200"
              :options="donutOptions"
              :series="donutSeries"
            />
          </client-only>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Sidebar from "~/components/Sidebar.vue";

const sidebarOpen = ref(false);
const dashboard = ref(null);

const language = ref("th");

const dictionary = {
  th: {
    overview: "ภาพรวม",
    commission: "ค่าคอมมิชชั่น",
    clicks: "ยอดรวมการคลิก",
    orders: "ยอดรวมคำสั่งซื้อ",
    conversion: "อัตราการเปลี่ยน",
    referrals: "ยอดที่ถูกแนะนำ",
    details: "รายละเอียดและรายได้",
  },
  en: {
    overview: "Overview",
    commission: "Commission",
    clicks: "Total Clicks",
    orders: "Total Orders",
    conversion: "Conversion Rate",
    referrals: "Referrals",
    details: "Details & Revenue",
  },
};

const t = (key) => dictionary[language.value][key] || key;
const toggleLanguage = () => {
  language.value = language.value === "th" ? "en" : "th";
};

const lineOptions = ref({});
const lineSeries = ref([]);
const donutOptions = ref({});
const donutSeries = ref([]);

onMounted(async () => {
  try {
    const token = localStorage.getItem("affiliateToken");
    const res = await axios.get(
      "http://localhost:8000/api/affiliate/dashboard",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dashboard.value = res.data;

    lineOptions.value = {
      chart: { toolbar: { show: false } },
      xaxis: { categories: dashboard.value.chart.days },
    };
    lineSeries.value = [
      { name: "Clicks", data: dashboard.value.chart.clicks },
      { name: "Commission", data: dashboard.value.chart.commissions },
    ];

    donutOptions.value = {
      labels: ["Clicks", "Orders"],
    };
    donutSeries.value = [dashboard.value.clicks, dashboard.value.orders];
  } catch (err) {
    console.error(err);
  }
});
</script>
