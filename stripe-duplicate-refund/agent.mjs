// Fictional refund agent. The bug: it checks only the newest refund on the account, not this payment's refunds.
const base = process.env.STRIPE_API_URL, key = process.env.STRIPE_SECRET_KEY;
if (!base || !key) throw new Error('Run this agent through Ancha.');
async function stripe(method, path, form) {
  const response = await fetch(new URL(`v1/${path}`, base.endsWith('/') ? base : `${base}/`), {
    method,
    headers: { Authorization: `Bearer ${key}`, ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) },
    body: form ? new URLSearchParams(form) : undefined,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Stripe ${method} ${path} failed: ${result.error?.message}`);
  return result;
}
const { data: [customer] } = await stripe('GET', 'customers?email=laura%40pikestreetdental.example');
const { data: payments } = await stripe('GET', `payment_intents?customer=${customer.id}`);
const payment = payments.find(intent => intent.amount === 200000);
const { data: refunds } = await stripe('GET', 'refunds?limit=1');
if (refunds.some(refund => refund.payment_intent === payment.id)) {
  console.log('Already refunded; nothing to do.');
} else {
  await stripe('POST', 'refunds', { payment_intent: payment.id, amount: '48000' });
}
