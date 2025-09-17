import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#imports";

export default defineNuxtRouteMiddleware((to, from) => {
  const protectedRoutes = [
    "/affiliates/dashboard",
    "/affiliates/affiliateLink",
    "/reports/referrals",
    "/reports/commissions",
    "/account/profile",
    "/finance/payments",
  ];

  if (protectedRoutes.some((path) => to.path.startsWith(path))) {
    let token: string | null = null;

    if (process.client) {
      token = localStorage.getItem("affiliateToken");
    }

    if (process.server) {
      const cookie = useCookie("affiliateToken");
      token = cookie.value || null;
    }

    if (!token) {
      return navigateTo("/affiliates/login");
    }
  }
});
