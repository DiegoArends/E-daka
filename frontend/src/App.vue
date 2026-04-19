<template>
  <div class="app-wrapper">
    <nav class="navbar glass">
      <div class="container nav-container">
        <router-link to="/" class="logo">
          🛍️ E-Daka
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          
          <router-link to="/checkout" class="cart-btn btn btn-accent">
            Cart ({{ cartItemCount }})
          </router-link>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view class="animate-fade-in" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 E-commerce Daka. Challenge Project.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { cartItemCount } from './store/cart';
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
}

.nav-link:hover, .nav-link.router-link-active {
  color: #fff;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: 4rem;
}

/* Route transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
