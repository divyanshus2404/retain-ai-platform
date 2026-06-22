// Simulate a Shopify Order Creation Webhook
const fetch = require('node-fetch'); // we'll just use native fetch if node 18+

async function sendWebhook() {
  const payload = {
    storeDomain: 'coffee-roasters.myshopify.com',
    orderId: 'shpfy_' + Math.floor(Math.random() * 1000000),
    email: 'sarah.smith@example.com',
    phone: '+15551234567',
    firstName: 'Sarah',
    lastName: 'Smith',
    totalPrice: '30.00'
  };

  try {
    const res = await fetch('http://localhost:3001/api/webhooks/shopify/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      console.log('✅ Webhook sent successfully and processed by backend.');
    } else {
      console.error('❌ Failed to process webhook', await res.text());
    }
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

sendWebhook();
