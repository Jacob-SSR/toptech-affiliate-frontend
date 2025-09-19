import { createI18n } from "vue-i18n";

export default defineNuxtPlugin((nuxtApp) => {
  const messages = {
    th: {
      dashboard: "แดชบอร์ด",
      affiliateLink: "ลิงก์แนะนำ",
      logout: "ออกจากระบบ",
      commissions: "ค่าคอมมิชชั่น",
      clicks: "จำนวนคลิก",
      orders: "คำสั่งซื้อ",
    },
    en: {
      dashboard: "Dashboard",
      affiliateLink: "Affiliate Link",
      logout: "Logout",
      commissions: "Commissions",
      clicks: "Clicks",
      orders: "Orders",
    },
  };

  const i18n = createI18n({
    legacy: false,
    locale: "th",
    fallbackLocale: "en",
    messages,
  });

  nuxtApp.vueApp.use(i18n);
  nuxtApp.provide("i18n", i18n);
});
