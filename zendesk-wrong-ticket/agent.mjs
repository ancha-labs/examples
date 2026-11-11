// Fictional support agent. The bug: it replies on the first of the customer's open tickets, which is the newest one.
const base = process.env.ZENDESK_API_URL, email = process.env.ZENDESK_EMAIL, token = process.env.ZENDESK_API_TOKEN;
if (!base || !email || !token) throw new Error('Run this agent through Ancha.');
async function zendesk(method, path, body) {
  const response = await fetch(`${base.replace(/\/$/, '')}/${path}`, {
    method,
    headers: { Authorization: `Basic ${Buffer.from(`${email}/token:${token}`).toString('base64')}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`Zendesk ${method} ${path} failed: ${response.status} ${await response.text()}`);
  return response.json();
}
const query = 'type:ticket requester:erin.walsh@ridgeway-robotics.example status<solved';
const { results } = await zendesk('GET', `search.json?query=${encodeURIComponent(query)}`);
const ticket = results[0];
await zendesk('PUT', `tickets/${ticket.id}.json`, { ticket: { comment: { body: 'Hi Erin, the fix for the empty CSV export ships on Thursday.', public: true } } });
