import { tg, currentUser } from "./telegram.js";

let cart = [];

export function loadCart() {
  const saved = localStorage.getItem("cart_" + currentUser.id);
  if (saved) cart = JSON.parse(saved);
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem("cart_" + currentUser.id, JSON.stringify(cart));
  updateCartBadge();
}

export function addToCart(product) {
  const item = cart.find(i => i.id === product.id);
  item ? item.quantity++ : cart.push({ ...product, quantity: 1 });
  saveCart();
  tg.showAlert("Додано в кошик");
}

export function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  displayCart();
}

export function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  badge.style.display = total ? "block" : "none";
  badge.textContent = total;
}

export function displayCart() {
  const el = document.getElementById("cartItems");
  if (!cart.length) {
    el.innerHTML = "Кошик порожній";
    return;
  }

  el.innerHTML = cart.map(i => `
    <div>
      ${i.name} × ${i.quantity}
      <button onclick='removeFromCart("${i.id}")'>🗑️</button>
    </div>
  `).join("");
}

export function checkout() {
  cart = [];
  saveCart();
  displayCart();
  tg.showAlert("Замовлення оформлено!");
}
