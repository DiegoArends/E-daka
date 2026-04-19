<template>
  <div class="container success-container">
    <div class="glass success-card">
      <div class="success-icon animate-fade-in">✅</div>
      <h1 class="success-title">Order Confirmed!</h1>
      <p class="success-message">
        Thank you for your purchase. Your payment was successful and your order is being processed.
      </p>
      
      <div v-if="isMock" class="mock-alert">
        <strong>Note:</strong> This was a simulated checkout because real API keys were not provided.
      </div>
      
      <router-link to="/" class="btn btn-primary mt-4">
        Return to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { cartState } from '../store/cart';

const route = useRoute();
const isMock = ref(false);

onMounted(() => {
  // Clear cart on successful checkout
  cartState.items = [];
  
  if (route.query.mock === 'true') {
    isMock.value = true;
  }
});
</script>

<style scoped>
.success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.success-card {
  max-width: 500px;
  width: 100%;
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 12px;
}

.success-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.success-title {
  color: var(--success-color);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.success-message {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.mock-alert {
  background: rgba(248, 81, 73, 0.1);
  border: 1px solid rgba(248, 81, 73, 0.3);
  color: var(--text-primary);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.mt-4 { margin-top: 1rem; }
</style>
