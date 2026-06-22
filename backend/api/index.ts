import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Shopify Webhook Endpoints ---
app.post('/api/webhooks/shopify/orders/create', async (req, res) => {
  const { storeDomain, orderId, email, phone, firstName, lastName, totalPrice } = req.body;
  
  try {
    // 1. Find or Create Store
    const store = await prisma.store.upsert({
      where: { domain: storeDomain },
      update: {},
      create: { name: storeDomain, domain: storeDomain }
    });

    // 2. Find or Create Customer
    // We try to match by email first. In a real app we'd use Shopify's customer ID.
    const customer = await prisma.customer.upsert({
      where: { storeId_email: { storeId: store.id, email: email } },
      update: { totalSpent: { increment: parseFloat(totalPrice) } },
      create: {
        storeId: store.id,
        email,
        phone,
        firstName,
        lastName,
        totalSpent: parseFloat(totalPrice)
      }
    });

    // 3. Create the Order
    await prisma.order.upsert({
      where: { shopifyId: orderId },
      update: { status: 'paid' },
      create: {
        storeId: store.id,
        customerId: customer.id,
        shopifyId: orderId,
        totalPrice: parseFloat(totalPrice),
        status: 'paid'
      }
    });

    console.log(`[Webhook] Order ${orderId} created for ${email}`);
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

// --- Meta/WhatsApp Webhook Endpoint ---
app.post('/api/webhooks/whatsapp', async (req, res) => {
  const { storeDomain, customerPhone, content, direction } = req.body;
  
  try {
    const store = await prisma.store.findUnique({ where: { domain: storeDomain } });
    if (!store) return res.status(404).send('Store not found');

    const customer = await prisma.customer.findUnique({
      where: { storeId_phone: { storeId: store.id, phone: customerPhone } }
    });

    if (!customer) return res.status(404).send('Customer not found');

    await prisma.message.create({
      data: {
        customerId: customer.id,
        direction: direction || 'inbound',
        channel: 'whatsapp',
        content,
        status: 'delivered',
        isAiGenerated: false
      }
    });

    // --- AI CHURN-SAVER LOGIC ---
    // In a real app, this sends the conversation history to an LLM
    if (content.toLowerCase().includes('cancel')) {
      const aiResponse = "Got it! Makes total sense. Instead of fully cancelling, how about I pause your next shipment for 4 weeks? You keep your loyal customer pricing, and it gives you time to catch up.";
      
      // Save AI Response to DB
      await prisma.message.create({
        data: {
          customerId: customer.id,
          direction: 'outbound',
          channel: 'whatsapp',
          content: aiResponse,
          status: 'sent',
          isAiGenerated: true
        }
      });
      
      console.log(`[AI Agent] Successfully intervened for ${customerPhone}`);
    }

    res.status(200).send('Message recorded');
  } catch (error) {
    console.error('Error recording message:', error);
    res.status(500).send('Error recording message');
  }
});

// --- REST API Endpoints for Dashboard ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RetainAI Backend is running.' });
});

app.get('/api/stats', async (req, res) => {
  try {
    // Real DB Query
    const totalOrders = await prisma.order.aggregate({
      _sum: { totalPrice: true }
    });
    
    const customersCount = await prisma.customer.count();
    
    // We still mock the negotiations part since we haven't built Phase 5 yet
    res.json({
      mrrSaved: totalOrders._sum.totalPrice || 0,
      subscriptionsRetained: customersCount,
      activeNegotiations: 2,
      recentSaves: [
        { id: 1, customer: 'Emma Watson', product: 'Premium Roast Coffee', value: '$45/mo', status: 'Saved - 15% Off' },
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // If none exist, we mock some for the demo
    if (campaigns.length === 0) {
      return res.json([
        { id: '1', name: 'Cart Abandonment', status: 'active', type: 'abandoned_cart', stats: { sent: 142, converted: 34 } },
        { id: '2', name: 'Winback Inactive', status: 'active', type: 'winback', stats: { sent: 500, converted: 12 } },
        { id: '3', name: 'Black Friday Broadcast', status: 'completed', type: 'broadcast', stats: { sent: 5000, converted: 450 } }
      ]);
    }
    
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
