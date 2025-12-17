import { initTelegram, tg, currentUser } from "./telegram.js";
import {
  loadProducts,
  loadMyProducts,
  addProduct,
  deleteProduct
} from "./storage.js";
import {
  loadCart,
  addToCart,
  removeFromCart,
  displayCart,
  updateCartBadge,
  checkout
} from "./cart.js";

// запуск Telegram
initTelegram();

// ===== ТАБЫ =====
window.switchTab = function (tab) {
  document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

  event.target.closest(".nav-tab").classList.add("active");
  document.getElementById(tab + "-tab").classList.add("active");

  if (tab === "products") loadProducts();
  if (tab === "my") loadMyProducts();
  if (tab === "cart") displayCart();
};

// ===== ФОРМА =====
document.getElementById("addProductForm").addEventListener("submit", async e => {
  e.preventDefault();
  await addProduct();
});

// ===== КОРЗИНА =====
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;

// старт
loadProducts();
loadCart();
