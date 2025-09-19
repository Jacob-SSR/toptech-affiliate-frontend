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
    if (process.client) {
      const token = localStorage.getItem("affiliateToken");

      if (!token) {
        return navigateTo("/affiliates/login");
      }
    }
  }
});
