import { useState } from "#app";

export const useAuth = () => {
  const token = useState("affiliateToken", () => null);

  if (process.client && !token.value) {
    const saved = localStorage.getItem("affiliateToken");
    if (saved) token.value = saved;
  }

  const setToken = (newToken) => {
    token.value = newToken;
    if (process.client) {
      if (newToken) {
        localStorage.setItem("affiliateToken", newToken);
      } else {
        localStorage.removeItem("affiliateToken");
      }
    }
  };

  return { token, setToken };
};
