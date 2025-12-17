// ===== ВКЛАДКИ =====
export function switchTab(tab) {
  document.querySelectorAll(".nav-tab").forEach(btn =>
    btn.classList.remove("active")
  );

  document.querySelectorAll(".tab-content").forEach(content =>
    content.classList.remove("active")
  );

  event.target.closest(".nav-tab").classList.add("active");
  document.getElementById(tab + "-tab").classList.add("active");
}

// ===== ESCAPE HTML (безопасность) =====
export function escapeHtml(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===== РЕНДЕР ТОВАРОВ =====
export function renderProducts(products, container, onAddToCart, onView) {
  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛍️</div>
        <h3>Товарів не знайдено</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="card">
      <div class="product-card">
        <div class="product-image">
          ${
            product.image
              ? `<img src="${product.image}">`
              : (product.emoji || "📦")
          }
        </div>
        <div class="product-info">
          <h3>${escapeHtml(product.name)}</h3>
          <div class="product-seller">👤 ${escapeHtml(product.sellerName)}</div>
          <p style="color:#ccc;font-size:0.9em">
            ${escapeHtml(product.description || "")}
          </p>
          <div class="product-price">${product.price} ₴</div>
          <div class="product-actions">
            <button class="primary" data-id="${product.id}">🛒 В кошик</button>
            <button class="secondary view-btn" data-id="${product.id}">👁️ Детальніше</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  // кнопки
  container.querySelectorAll(".primary").forEach(btn => {
    btn.onclick = () => onAddToCart(btn.dataset.id);
  });

  container.querySelectorAll(".view-btn").forEach(btn => {
    btn.onclick = () => onView(btn.dataset.id);
  });
}
