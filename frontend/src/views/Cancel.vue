<template>
  <div class="container cancel-container">
    <div class="glass cancel-card animate-fade-in">
      <div class="cancel-icon">🛒</div>
      <h1 class="cancel-title">Payment Cancelled</h1>
      <p class="cancel-message">
        No worries! Your cart items are still saved. You can try again when you're ready or choose a different payment method.
      </p>
      
      <div class="actions">
        <router-link to="/checkout" class="btn btn-primary">
          Back to Cart
        </router-link>
        <router-link to="/" class="btn btn-accent">
          Keep Browsing
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { setMeta } from '../utils/seo';

onMounted(() => {
  setMeta('Order Cancelled', 'Your payment was cancelled, but your items are still in your cart at E-Daka.');
});
</script>

<style scoped>
.cancel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.cancel-card {
  max-width: 500px;
  width: 100%;
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 12px;
}

.cancel-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.cancel-title {
  color: #fff;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cancel-message {
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 480px) {
  .actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
