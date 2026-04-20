require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for payment capture storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `capture-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load mock products
const productsPath = path.join(__dirname, 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Route: Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Route: Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Route: Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, paymentMethod = 'stripe' } = req.body;
    
    // Determine the base URL dynamically from the request origin
    const origin = req.get('origin') || req.get('referer');
    const frontendUrl = process.env.FRONTEND_URL || (origin ? new URL(origin).origin : 'http://localhost:5173');
    
    // Format items for Stripe
    const lineItems = items.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) throw new Error('Product not found');
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.price, // price in cents
        },
        quantity: item.quantity,
      };
    });

    if (paymentMethod === 'paypal') {
      // High-fidelity PayPal simulation
      return res.json({ url: `${frontendUrl}/success?method=paypal&mock=true` });
    }

    if (paymentMethod === 'local') {
      // Local Payment (Megasoft/Instapago) simulation
      return res.json({ url: `${frontendUrl}/success?method=local&mock=true` });
    }

    try {
      // Attempt to create a standard Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${frontendUrl}/success?method=stripe`,
        cancel_url: `${frontendUrl}/cancel`,
      });

      res.json({ url: session.url });
    } catch (stripeError) {
      // Fallback if Stripe key is a placeholder
      console.warn("Stripe key is likely invalid. Using mock checkout URL.");
      res.json({ url: `${frontendUrl}/success?method=stripe&mock=true` });
    }

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: Upload payment capture
app.post('/api/upload-capture', upload.single('capture'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // In a real app, you would save req.body.reference and req.file.path to a database
    console.log(`Payment capture received: ${req.file.path} (Ref: ${req.body.reference})`);
    
    res.json({ 
      message: 'Upload successful', 
      filePath: `/uploads/${req.file.filename}` 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Catch-all middleware to serve index.html for SPA (must be at the end)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
