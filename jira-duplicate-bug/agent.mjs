// Fictional escalation agent. The bug: it searches only To Do issues, misses the bug already In Progress and files a duplicate.
const env = process.env;
if (!env.ZENDESK_API_URL || !env.ZENDESK_EMAIL || !env.ZENDESK_API_TOKEN || !env.JIRA_BASE_URL || !env.JIRA_EMAIL || !env.JIRA_API_TOKEN) throw new Error('Run this agent through Ancha.');
const basic = (user, secret) => `Basic ${Buffer.from(`${user}:${secret}`).toString('base64')}`;
async function call(name, base, auth, method, path, body) {
  const response = await fetch(`${base.replace(/\/$/, '')}/${path}`, {
    method,
    headers: { Authorization: auth, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`${name} ${method} ${path} failed: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}
const zendesk = (method, path, body) => call('Zendesk', env.ZENDESK_API_URL, basic(`${env.ZENDESK_EMAIL}/token`, env.ZENDESK_API_TOKEN), method, path, body);
const jira = (method, path, body) => call('Jira', env.JIRA_BASE_URL, basic(env.JIRA_EMAIL, env.JIRA_API_TOKEN), method, path, body);

const { ticket } = await zendesk('GET', 'tickets/4101.json');
const jql = 'project = OPS AND status = "To Do" AND text ~ "CSV export"';
const { issues } = await jira('POST', 'rest/api/3/search/jql', { jql, fields: ['summary'] });
const text = { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: `Zendesk #${ticket.id}, Ridgeway Robotics: ${ticket.subject}.` }] }] };
let key;
if (issues.length) {
  key = issues[0].key;
  await jira('POST', `rest/api/3/issue/${key}/comment`, { body: text });
} else {
  ({ key } = await jira('POST', 'rest/api/3/issue', { fields: { project: { key: 'OPS' }, issuetype: { name: 'Bug' }, summary: 'CSV export returns an empty file', description: text } }));
}
await zendesk('PUT', `tickets/${ticket.id}.json`, { ticket: { comment: { body: `Escalated to engineering as ${key}.`, public: false } } });
