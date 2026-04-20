<template>
  <div class="container">
    <div class="hero">
      <h1 class="hero-title">Premium Technology</h1>
      <p class="hero-subtitle">Curated selection for modern professionals.</p>
    </div>

    <div class="categories-nav">
      <button 
        v-for="cat in categories" 
        :key="cat" 
        class="cat-btn"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card glass">
        <div class="product-img-wrapper">
          <img :src="product.image" :alt="product.name" class="product-image" loading="lazy" />
          <div v-if="product.badge" class="badge" :class="product.badge.toLowerCase()">
            {{ product.badge }}
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">{{ product.category }}</div>
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-desc">{{ product.description }}</p>
          <div class="product-footer">
            <div class="price-container">
              <span class="product-price">{{ formatUSD(product.price) }}</span>
              <span class="product-price-bs">{{ formatBS(product.price) }}</span>
            </div>
            <button @click="addToCart(product)" class="btn btn-primary add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { addToCart } from '../store/cart';
import { setMeta } from '../utils/seo';
import { formatUSD, formatBS } from '../utils/currency';

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCategory = ref('All');

const categories = computed(() => {
  const cats = ['All', ...new Set(products.value.map(p => p.category))];
  return cats;
});

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') return products.value;
  return products.value.filter(p => p.category === selectedCategory.value);
});

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    products.value = await response.json();
  } catch (err) {
    error.value = 'Could not load products. Ensure the backend is running.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
  setMeta('Home', 'Browse the latest premium technology products at E-Daka. Smart watches, headphones, and more.');
});
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 3rem;
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--header-bg) 0%, #fff 100%);
  border-radius: 0 0 50px 50px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.categories-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.cat-btn {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cat-btn:hover {
  border-color: var(--accent-color);
  color: #fff;
}

.cat-btn.active {
  background: var(--accent-color);
  color: #fff;
  border-color: var(--accent-color);
  box-shadow: 0 4px 12px rgba(47, 129, 247, 0.3);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--header-bg);
}

.product-img-wrapper {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.badge.hot { background: var(--danger-color); color: #fff; }
.badge.new { background: var(--accent-color); color: #fff; }
.badge.sale { background: var(--success-color); color: #fff; }

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-category {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-color);
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.product-name {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 700;
}

.product-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  flex: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--accent-color);
}

.product-price-bs {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.add-to-cart-btn {
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.loading, .error {
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
