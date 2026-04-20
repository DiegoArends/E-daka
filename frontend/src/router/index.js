import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Checkout from '../views/Checkout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'E-commerce Daka | Home',
      metaTags: [
        {
          name: 'description',
          content: 'The best sleek e-commerce platform for top tier tech products.'
        }
      ]
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: {
      title: 'E-commerce Daka | Checkout'
    }
  },
  {
    path: '/success',
    name: 'Success',
    component: () => import('../views/Success.vue'),
    meta: {
      title: 'Success | Order Completed'
    }
  },
  {
    path: '/cancel',
    name: 'Cancel',
    component: () => import('../views/Cancel.vue'),
    meta: {
      title: 'Payment Cancelled | E-Daka'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Simple SEO handling based on routes
router.beforeEach((to, from, next) => {
  // Update document title
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Update meta tags
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  if(!nearestWithMeta) return next();

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');
    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    tag.setAttribute('data-vue-router-controlled', '');
    return tag;
  })
  .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router;
