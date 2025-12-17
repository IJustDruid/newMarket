import { tg, currentUser } from "./telegram.js";

let currentImageData = null;

// IMAGE
window.previewImage = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    tg.showAlert("Файл занадто великий!");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    currentImageData = e.target.result;
    document.getElementById("previewImg").src = currentImageData;
    document.getElementById("imagePreview").style.display = "block";
  };
  reader.readAsDataURL(file);
};

window.clearImage = function () {
  currentImageData = null;
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("productImage").value = "";
};

// LOAD PRODUCTS
export async function loadProducts() {
  const container = document.getElementById("productsList");
  container.innerHTML = "Завантаження...";

  const result = await window.storage.list("product:", true);
  if (!result?.keys?.length) {
    container.innerHTML = "Товарів немає";
    return;
  }

  const products = [];
  for (const key of result.keys) {
    const data = await window.storage.get(key, true);
    if (data?.value) products.push(JSON.parse(data.value));
  }

  products.sort((a, b) => b.timestamp - a.timestamp);
  renderProducts(products, container);
}

// RENDER
function renderProducts(products, container) {
  container.innerHTML = products.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <div>${p.price} ₴</div>
      <button onclick='addToCart(${JSON.stringify(p)})'>🛒 В кошик</button>
    </div>
  `).join("");
}

// ADD PRODUCT
export async function addProduct() {
  const name = productName.value.trim();
  const price = +productPrice.value;

  if (!name || price <= 0) {
    tg.showAlert("Заповніть поля");
    return;
  }

  const product = {
    id: "prod_" + Date.now(),
    name,
    price,
    image: currentImageData,
    sellerId: currentUser.id,
    sellerName: currentUser.first_name,
    timestamp: Date.now()
  };

  await window.storage.set("product:" + product.id, JSON.stringify(product), true);
  tg.showAlert("Товар додано!");

  addProductForm.reset();
  clearImage();
}

// MY PRODUCTS
export async function loadMyProducts() {
  const container = document.getElementById("myProductsList");
  const result = await window.storage.list("product:", true);

  const my = [];
  for (const key of result.keys) {
    const data = await window.storage.get(key, true);
    const p = JSON.parse(data.value);
    if (p.sellerId === currentUser.id) my.push(p);
  }

  container.innerHTML = my.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <button onclick='deleteProduct("${p.id}")'>🗑️</button>
    </div>
  `).join("");
}

export async function deleteProduct(id) {
  await window.storage.delete("product:" + id, true);
  loadMyProducts();
}
