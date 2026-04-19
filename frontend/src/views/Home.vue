<template>
  <div class="container">
    <div class="hero">
      <h1 class="hero-title">Welcome to E-Daka</h1>
      <p class="hero-subtitle">Premium technology products for modern professionals.</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card glass">
        <div class="product-img-wrapper">
          <img :src="product.image" :alt="product.name" class="product-image" loading="lazy" />
        </div>
        <div class="product-info">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-desc">{{ product.description }}</p>
          <div class="product-footer">
            <span class="product-price">{{ formatPrice(product.price) }}</span>
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
import { ref, onMounted } from 'vue';
import { addToCart } from '../store/cart';

const products = ref([]);
const loading = ref(true);
const error = ref(null);

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

const formatPrice = (cents) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100);
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 0;
  background: radial-gradient(circle at 50% -20%, rgba(88, 166, 255, 0.15) 0%, transparent 60%);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #fff, #8b949e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border-color: rgba(88, 166, 255, 0.3);
}

.product-img-wrapper {
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #fff;
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
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
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
