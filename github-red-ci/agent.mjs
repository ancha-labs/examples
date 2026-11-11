// Fictional release bot. The bug: it merges when any check run passed, not only when all of them did.
const base = process.env.GITHUB_API_URL, token = process.env.GITHUB_TOKEN;
if (!base || !token) throw new Error('Run this agent through Ancha.');
async function github(method, path, body) {
  const response = await fetch(new URL(path, base.endsWith('/') ? base : `${base}/`), {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`GitHub ${method} ${path} failed: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}
const pulls = await github('GET', 'repos/acme/orders/pulls?state=open');
const revert = pulls.find(pull => pull.title.startsWith('Revert'));
const { check_runs: runs } = await github('GET', `repos/acme/orders/commits/${revert.head.sha}/check-runs`);
const green = runs.some(run => run.conclusion === 'success');
if (green) {
  await github('PUT', `repos/acme/orders/pulls/${revert.number}/merge`, { merge_method: 'merge' });
} else {
  const failed = runs.filter(run => run.conclusion !== 'success').map(run => run.name).join(', ');
  await github('POST', `repos/acme/orders/issues/${revert.number}/comments`, { body: `Not merging yet: ${failed} failed.` });
}
