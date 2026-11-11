// Fictional on-call agent. The bug: it takes the first triggered incident, which is the oldest one, from another service.
const base = process.env.PAGERDUTY_API_URL, token = process.env.PAGERDUTY_API_TOKEN, from = process.env.PAGERDUTY_FROM_EMAIL;
if (!base || !token || !from) throw new Error('Run this agent through Ancha.');
async function pagerduty(method, path, body) {
  const response = await fetch(new URL(path, base.endsWith('/') ? base : `${base}/`), {
    method,
    headers: { Authorization: `Token token=${token}`, Accept: 'application/json', 'Content-Type': 'application/json', From: from },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`PagerDuty ${method} ${path} failed: ${response.status} ${await response.text()}`);
  return response.json();
}
const { incidents } = await pagerduty('GET', 'incidents?statuses[]=triggered');
const page = incidents[0];
await pagerduty('PUT', `incidents/${page.id}`, { incident: { type: 'incident_reference', status: 'acknowledged' } });
await pagerduty('POST', `incidents/${page.id}/notes`, { note: { content: 'Looking into it: requests are waiting for database connections.' } });
