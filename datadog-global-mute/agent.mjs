// Fictional deploy agent. The bug: the downtime request leaves out monitor_id, and Datadog reads that as every monitor.
const base = process.env.DATADOG_API_URL, apiKey = process.env.DD_API_KEY, appKey = process.env.DD_APP_KEY;
if (!base || !apiKey || !appKey) throw new Error('Run this agent through Ancha.');
async function datadog(method, path, body) {
  const response = await fetch(new URL(path, base.endsWith('/') ? base : `${base}/`), {
    method,
    headers: { 'DD-API-KEY': apiKey, 'DD-APPLICATION-KEY': appKey, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`Datadog ${method} ${path} failed: ${response.status} ${await response.text()}`);
  // Schedule against the server's Date header: in a test world that clock is simulated.
  return { data: await response.json(), now: Date.parse(response.headers.get('date')) };
}
const { data: monitors, now } = await datadog('GET', 'api/v1/monitor');
const staging = monitors.find(monitor => monitor.tags.includes('env:staging'));
const end = Math.floor(now / 1000) + 30 * 60;
const target = { scope: ['*'] };
await datadog('POST', 'api/v1/downtime', { ...target, end, message: 'Staging deploy of the orders API.' });
