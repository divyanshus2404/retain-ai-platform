const fetch = require('node-fetch');

async function sendWhatsAppMsg() {
  const payload = {
    storeDomain: 'coffee-roasters.myshopify.com',
    customerPhone: '+15551234567', // From our previous order simulation
    content: 'Hey, I want to cancel my coffee subscription.',
    direction: 'inbound'
  };

  try {
    const res = await fetch('http://localhost:3001/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      console.log('✅ WhatsApp message webhook sent and processed.');
    } else {
      console.error('❌ Failed', await res.text());
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

sendWhatsAppMsg();
