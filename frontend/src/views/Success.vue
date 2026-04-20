<template>
  <div class="container success-container">
    <div class="glass success-card">
      <div class="success-icon slide-up">🚀</div>
      <h1 class="success-title">Order Confirmed!</h1>
      <p class="success-message">
        <span v-if="paymentMethod === 'local'">
          Su comprobante ha sido recibido. Nuestro equipo verificará la operación en breve.
        </span>
        <span v-else>
          Thank you for your purchase. Your payment was successful via <strong>{{ paymentMethodLabel }}</strong>.
        </span>
      </p>
      
      <div class="order-details-summary glass">
        <div class="detail-row">
          <span>Status</span>
          <span class="status-badge">Processing</span>
        </div>
        <div class="detail-row">
          <span>Payment Method</span>
          <span>{{ paymentMethodLabel }}</span>
        </div>
      </div>
      
      <div v-if="isMock" class="mock-alert">
        <strong>Project Demo:</strong> This was a simulated checkout to demonstrate payment gateway integration without real credentials.
      </div>
      
      <router-link to="/" class="btn btn-primary mt-4">
        Return to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { cartState } from '../store/cart';
import { setMeta } from '../utils/seo';

const route = useRoute();
const isMock = ref(false);
const paymentMethod = ref('stripe');

const paymentMethodLabel = computed(() => {
  const method = route.query.method || 'stripe';
  if (method === 'stripe') return 'Credit Card';
  if (method === 'paypal') return 'PayPal';
  if (method === 'local') return 'Local Gateway';
  return 'Credit Card';
});

onMounted(() => {
  // Clear cart on successful checkout
  cartState.items = [];
  localStorage.removeItem('cart');
  
  if (route.query.mock === 'true') {
    isMock.value = true;
  }
  paymentMethod.value = route.query.method || 'stripe';
  
  setMeta('Order Confirmed', 'Thank you for your purchase! Your order at E-Daka is being processed.');
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
  display: block;
}

.slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.success-title {
  color: var(--accent-color);
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.success-message {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.order-details-summary {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.status-badge {
  background: var(--success-color);
  color: #fff;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.mock-alert {
  background: rgba(88, 166, 255, 0.1);
  border: 1px solid rgba(88, 166, 255, 0.3);
  color: var(--text-primary);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.mt-4 { margin-top: 1rem; }
</style>
