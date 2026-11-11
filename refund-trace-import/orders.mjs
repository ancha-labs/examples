// The store's order API, as the agent calls it in production. In a test the wrappers answer instead.
const api = process.env.ORDERS_API_URL;

export async function lookupOrder({ order_id }) {
  const response = await fetch(`${api}/orders/${order_id}`);
  return response.json();
}

export async function refundOrder({ order_id }) {
  const response = await fetch(`${api}/orders/${order_id}/refunds`, { method: 'POST' });
  return response.json();
}
