// Fictional support bot. The bug is findLast: Slack history is newest first.
const base = process.env.SLACK_API_URL;
if (!base || !process.env.SLACK_BOT_TOKEN) throw new Error('Run this bot through Ancha.');
async function call(method, data = {}) {
  const response = await fetch(new URL(method, base.endsWith('/') ? base : `${base}/`), {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(`Slack method failed: ${method}`);
  return result;
}
const { channels } = await call('conversations.list');
const support = channels.find(channel => channel.name === 'support');
const { messages } = await call('conversations.history', { channel: support.id });
const question = messages.findLast(message => message.text.endsWith('?'));
if (!question) throw new Error('No question found.');
const text = /invite/i.test(question.text)
  ? 'Settings → Members → Invite.'
  : 'Reports → Exports → Download CSV.';
await call('chat.postMessage', { channel: support.id, thread_ts: question.ts, text });
