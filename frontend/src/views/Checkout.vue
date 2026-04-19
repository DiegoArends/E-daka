<template>
  <div class="container checkout-container">
    <div class="checkout-grid">
      
      <!-- Cart Section -->
      <div class="cart-section glass">
        <h2>Your Cart</h2>
        
        <div v-if="cartState.items.length === 0" class="empty-cart">
          <p>Your cart is currently empty.</p>
          <router-link to="/" class="btn btn-accent mt-4">Continue Shopping</router-link>
        </div>
        
        <div v-else class="cart-items">
          <div v-for="item in cartState.items" :key="item.id" class="cart-item">
             <img :src="item.image" :alt="item.name" class="cart-item-img" />
             <div class="cart-item-details">
               <h3>{{ item.name }}</h3>
               <p class="item-price">{{ formatPrice(item.price) }}</p>
               
               <div class="quantity-controls">
                 <button @click="updateQuantity(item.id, -1)" class="qty-btn">-</button>
                 <span>{{ item.quantity }}</span>
                 <button @click="updateQuantity(item.id, 1)" class="qty-btn">+</button>
               </div>
             </div>
             
             <button @click="removeFromCart(item.id)" class="remove-btn" title="Remove item">
               ❌
             </button>
          </div>
        </div>
      </div>

      <!-- Payment Section -->
      <div class="payment-section glass">
        <h2>Order Summary</h2>
        
        <div class="summary-details">
          <div class="summary-row">
            <span>Subtotal ({{ cartItemCount }} items)</span>
            <span>{{ formatPrice(cartTotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="summary-row total-row">
            <span>Total</span>
            <span>{{ formatPrice(cartTotal) }}</span>
          </div>
        </div>

        <button 
          @click="checkout" 
          :disabled="cartState.items.length === 0 || isProcessing"
          class="btn btn-primary checkout-btn"
        >
          <span v-if="isProcessing">Processing...</span>
          <span v-else>Pay with Stripe</span>
        </button>
        
        <p class="secure-badge">🔒 Secure checkout provided by Stripe</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { cartState, cartTotal, cartItemCount, removeFromCart, updateQuantity } from '../store/cart';

const isProcessing = ref(false);

const formatPrice = (cents) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100);
};

const checkout = async () => {
  if (cartState.items.length === 0) return;
  
  isProcessing.value = true;
  
  try {
    const items = cartState.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();
    
    if (data.url) {
      // Redirect to Stripe checkout (or mock success URL)
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Failed to create checkout session');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Payment initialization failed. Ensure backend is running.');
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.checkout-container {
  max-width: 1000px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .checkout-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.cart-section, .payment-section {
  padding: 2rem;
  border-radius: 12px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.empty-cart {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-secondary);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(48, 54, 61, 0.5);
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cart-item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-details {
  flex: 1;
}

.cart-item-details h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.item-price {
  color: var(--accent-color);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-color);
  width: max-content;
  padding: 0.25rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.qty-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  background: var(--surface-color);
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0.5rem;
}

.remove-btn:hover {
  opacity: 1;
}

.summary-details {
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.total-row {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1.5rem;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mt-4 { margin-top: 1rem; }

.secure-badge {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
