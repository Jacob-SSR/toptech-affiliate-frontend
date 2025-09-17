<template>
  <aside
    class="w-full md:w-64 bg-gray-900 text-white flex flex-col"
    :class="{ hidden: !isOpen && isMobile }"
  >
    <!-- Header -->
    <div
      class="p-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center"
    >
      <span>Logo</span>
      <!-- ปุ่มปิดบนมือถือ -->
      <button
        v-if="isMobile"
        @click="$emit('close')"
        class="text-gray-400 hover:text-white"
      >
        ✕
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 p-4 space-y-2 text-sm">
      <p class="text-gray-400 text-xs">ภาพรวม</p>
      <router-link
        to="/affiliates/dashboard"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800': isActive('/dashboard') }"
      >
        หน้าหลัก
      </router-link>

      <p class="text-gray-400 text-xs mt-4">การสร้างลิงก์</p>
      <router-link
        to="/affiliates/affiliateLink"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800': isActive('/affiliate/link') }"
      >
        สร้างลิงก์ Affiliate
      </router-link>

      <p class="text-gray-400 text-xs mt-4">รายงาน</p>
      <router-link
        to="/reports/referrals"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800': isActive('/reports/referrals') }"
      >
        รายงานการแนะนำ
      </router-link>
      <router-link
        to="/reports/commissions"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800': isActive('/reports/commissions') }"
      >
        รายงานค่าคอมมิชชั่น
      </router-link>

      <p class="text-gray-400 text-xs mt-4">บัญชีของฉัน</p>
      <router-link
        to="/account/profile"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800': isActive('/account/profile') }"
      >
        ข้อมูลส่วนตัว
      </router-link>

      <p class="text-gray-400 text-xs mt-4">การเงิน</p>
      <router-link
        to="/finance/payments"
        class="block py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-800': isActive('/finance/payments') }"
      >
        ประวัติการจ่ายเงิน
      </router-link>
    </nav>

    <!-- Logout button -->
    <div class="p-4 border-t border-gray-700">
      <button
        @click="logout"
        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
      >
        ออกจากระบบ
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { signOut } from "firebase/auth";

const props = defineProps({
  isOpen: { type: Boolean, default: true },
});

const isMobile = ref(false);
const router = useRouter();

const handleResize = () => {
  if (typeof window !== "undefined") {
    isMobile.value = window.innerWidth < 768;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
});

const route = useRoute();
const isActive = (path) => route.path.startsWith(path);

const { $auth } = useNuxtApp();

const logout = async () => {
  try {
    localStorage.removeItem("affiliateToken");

    if ($auth) {
      await signOut($auth);
    }

    router.push("/affiliates/login");
  } catch (err) {
    console.error("Logout error:", err);
  }
};
</script>
