import { reactive, computed } from 'vue';

export const cartState = reactive({
  items: []
});

export const addToCart = (product) => {
  const existingItem = cartState.items.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartState.items.push({ ...product, quantity: 1 });
  }
};

export const removeFromCart = (productId) => {
  const index = cartState.items.findIndex(item => item.id === productId);
  if (index !== -1) {
    cartState.items.splice(index, 1);
  }
};

export const updateQuantity = (productId, amount) => {
  const item = cartState.items.find(item => item.id === productId);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    }
  }
};

export const cartTotal = computed(() => {
  return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

export const cartItemCount = computed(() => {
  return cartState.items.reduce((count, item) => count + item.quantity, 0);
});
