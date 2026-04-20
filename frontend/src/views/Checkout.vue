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
        <h2>Payment Method</h2>
        
        <div class="payment-methods">
          <div 
            class="payment-method-card" 
            :class="{ active: selectedMethod === 'stripe' }"
            @click="selectedMethod = 'stripe'"
          >
            <div class="method-icon">💳</div>
            <div class="method-info">
              <span class="method-name">Credit Card</span>
              <span class="method-sub">Stripe Secure</span>
            </div>
          </div>

          <div 
            class="payment-method-card" 
            :class="{ active: selectedMethod === 'paypal' }"
            @click="selectedMethod = 'paypal'"
          >
            <div class="method-icon">🅿️</div>
            <div class="method-info">
              <span class="method-name">PayPal</span>
              <span class="method-sub">Fast & Secure</span>
            </div>
          </div>

          <div 
            class="payment-method-card" 
            :class="{ active: selectedMethod === 'local' }"
            @click="selectedMethod = 'local'"
          >
            <div class="method-icon">🇻🇪</div>
            <div class="method-info">
              <span class="method-name">Local Payment</span>
              <span class="method-sub">Pago Móvil / Transferencia</span>
            </div>
          </div>
        </div>

        <!-- Local Payment Instructions -->
        <div v-if="selectedMethod === 'local'" class="local-payment-instructions glass slide-up">
          <h4>📌 Instrucciones de Pago</h4>
          <p class="instr-note">Realice el pago a los siguientes datos y luego envíe el comprobante.</p>
          
          <div class="instr-section">
            <h5>Pago Móvil</h5>
            <ul>
              <li><strong>Banco:</strong> Banesco (0134)</li>
              <li><strong>Teléfono:</strong> 0412-1234567</li>
              <li><strong>RIF:</strong> J-12345678-9</li>
            </ul>
          </div>

          <div class="instr-section">
            <h5>Transferencia Bancaria</h5>
            <ul>
              <li><strong>Banco:</strong> Banesco</li>
              <li><strong>Cuenta:</strong> 0134-XXXX-XX-XXXXXXXXXX</li>
              <li><strong>Nombre:</strong> E-Daka Retail C.A.</li>
            </ul>
          </div>

          <div class="instr-footer">
            <span class="rate-badge">Tasa BCV: {{ exchangeRate }} BS/USD</span>
          </div>

          <!-- Capture Upload Section -->
          <div class="capture-upload-section">
            <h5>Subir Comprobante</h5>
            <div class="form-group">
              <label for="reference">Número de Referencia</label>
              <input 
                type="text" 
                id="reference" 
                v-model="referenceNumber" 
                placeholder="Ej. 12345678"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label class="file-label">
                <input type="file" @change="handleFileUpload" accept="image/*" class="file-input" />
                <span class="btn btn-accent btn-sm">📎 Seleccionar Capture</span>
              </label>
            </div>

            <!-- Preview Container -->
            <div v-if="capturePreview" class="preview-container slide-up">
              <img :src="capturePreview" alt="Capture Preview" class="capture-preview" />
              <button @click="clearCapture" class="btn-remove">✕</button>
            </div>

            <button 
              @click="submitLocalPayment" 
              :disabled="!isLocalFormValid || isProcessing"
              class="btn btn-primary w-full mt-4"
            >
              <span v-if="isProcessing">Enviando...</span>
              <span v-else>Confirmar Pago Local</span>
            </button>
          </div>
        </div>

        <div class="order-summary-box">
          <h3>Order Summary</h3>
          <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal ({{ cartItemCount }} items)</span>
              <div class="price-val">
                <span>{{ formatUSD(cartTotal) }}</span>
                <span class="sub-price">{{ formatBS(cartTotal) }}</span>
              </div>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="summary-row total-row">
              <span>Total</span>
              <div class="price-val">
                <span>{{ formatUSD(cartTotal) }}</span>
                <span class="sub-price-total">{{ formatBS(cartTotal) }}</span>
              </div>
            </div>
          </div>

          <!-- Standard Checkout Button (Stripe) -->
          <button 
            v-if="selectedMethod === 'stripe'"
            @click="checkout" 
            :disabled="cartState.items.length === 0 || isProcessing"
            class="btn btn-primary checkout-btn"
          >
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Pay with Stripe</span>
          </button>

          <!-- Real PayPal Button Container -->
          <div 
            v-show="selectedMethod === 'paypal'" 
            id="paypal-button-container" 
            class="paypal-container slide-up"
          ></div>
          
          <p class="secure-badge">🔒 Encrypted & Secure Checkout</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { cartState, cartTotal, cartItemCount, removeFromCart, updateQuantity } from '../store/cart';
import { setMeta } from '../utils/seo';
import { formatUSD, formatBS, getExchangeRate } from '../utils/currency';

onMounted(() => {
  setMeta('Checkout', 'Complete your purchase securely at E-Daka. Multiple payment options available.');
});

const router = useRouter();
const isProcessing = ref(false);
const selectedMethod = ref('stripe');
const exchangeRate = getExchangeRate();

const referenceNumber = ref('');
const selectedFile = ref(null);
const capturePreview = ref(null);

const isLocalFormValid = computed(() => {
  return referenceNumber.value.length > 3 && selectedFile.value;
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    capturePreview.value = URL.createObjectURL(file);
  }
};

const clearCapture = () => {
  selectedFile.value = null;
  capturePreview.value = null;
};

const submitLocalPayment = async () => {
  if (!isLocalFormValid.value) return;
  
  isProcessing.value = true;
  
  try {
    const formData = new FormData();
    formData.append('capture', selectedFile.value);
    formData.append('reference', referenceNumber.value);
    formData.append('items', JSON.stringify(cartState.items));

    const response = await fetch('/api/upload-capture', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      window.location.href = '/success?method=local&mock=true';
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Local payment error:', error);
    alert('Error al subir el comprobante. Intente de nuevo.');
  } finally {
    isProcessing.value = false;
  }
};

const methodLabel = computed(() => {
  if (selectedMethod.value === 'stripe') return 'Stripe';
  if (selectedMethod.value === 'paypal') return 'PayPal';
  return 'Local Gateways';
});

const formatPrice = (cents) => formatUSD(cents);

// PayPal Integration Logic
const initPayPal = () => {
  if (!window.paypal) return;
  
  // Clear any existing button
  const container = document.getElementById('paypal-button-container');
  if (container) container.innerHTML = '';

  window.paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: (cartTotal.value / 100).toFixed(2)
          }
        }]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        // Redirect to success page
        window.location.href = `/success?method=paypal&mock=true`;
      });
    },
    onError: (err) => {
      console.error('PayPal Error:', err);
    }
  }).render('#paypal-button-container');
};

watch(selectedMethod, (newMethod) => {
  if (newMethod === 'paypal') {
    // Small delay to ensure container is visible
    setTimeout(initPayPal, 100);
  }
});

onMounted(() => {
  setMeta('Checkout', 'Complete your purchase securely at E-Daka. Multiple payment options available.');
  if (selectedMethod.value === 'paypal') initPayPal();
});

const checkout = async () => {
  if (cartState.items.length === 0) return;
  if (selectedMethod.value === 'paypal') return; // PayPal handles its own checkout
  
  isProcessing.value = true;
  // ... rest of checking logic
  
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
      body: JSON.stringify({ 
        items,
        paymentMethod: selectedMethod.value
      }),
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

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-method-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.02);
}

.payment-method-card:hover {
  border-color: var(--accent-color);
  background: rgba(88, 166, 255, 0.05);
}

.payment-method-card.active {
  border-color: var(--accent-color);
  background: rgba(88, 166, 255, 0.1);
  box-shadow: 0 0 15px rgba(88, 166, 255, 0.2);
}

.method-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border-radius: 8px;
}

.method-info {
  display: flex;
  flex-direction: column;
}

.method-name {
  font-weight: 700;
  color: var(--text-primary);
}

.method-sub {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.order-summary-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.order-summary-box h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
}

.local-payment-instructions {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(47, 129, 247, 0.05);
  border-left: 4px solid var(--accent-color);
}

.local-payment-instructions h4 {
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.instr-note {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

.instr-section {
  margin-bottom: 1.25rem;
}

.instr-section h5 {
  font-size: 0.9rem;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.instr-section ul {
  list-style: none;
  font-size: 0.9rem;
}

.instr-section li {
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.instr-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.rate-badge {
  background: var(--surface-color);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.slide-up {
  animation: slideUp 0.4s easeOut;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.order-summary-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.order-summary-box h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #fff;
}

.summary-details {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  color: #333;
  align-items: flex-start;
}

.price-val {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.sub-price {
  font-size: 0.8rem;
  opacity: 0.7;
}

.total-row {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--accent-color);
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

.sub-price-total {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.paypal-container {
  margin-top: 1.5rem;
  min-height: 150px;
}

.capture-upload-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.capture-upload-section h5 {
  margin-bottom: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #333;
}

.form-input {
  background: #fff;
  border: 1px solid var(--border-color);
  color: #000;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.file-input {
  display: none;
}

.file-label {
  cursor: pointer;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.preview-container {
  position: relative;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  width: max-content;
  max-width: 100%;
}

.capture-preview {
  max-width: 200px;
  display: block;
}

.btn-remove {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.w-full { width: 100%; }
</style>
