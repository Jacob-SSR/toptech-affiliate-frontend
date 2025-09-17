// middleware/auth.js
export default defineNuxtRouteMiddleware(() => {
  const token = process.client ? localStorage.getItem("affiliateToken") : null;

  if (!token) {
    return navigateTo("/affiliates/login");
  }
});
