# Mute the staging monitor, not production

A fictional Datadog organization with two latency monitors for the orders API, one tagged env:prod and one tagged env:staging, both OK. The agent should mute the staging monitor for a 30-minute deploy and leave production alerting. No real Datadog account is involved.

Requires Node.js 24 and @ancha-labs/cli 0.4.3. The agent uses Node's built-in fetch, no model and no Datadog keys. It schedules against the server's Date header, because the world's clock is simulated.

In this directory:

    ancha init --agent "node agent.mjs"
    ancha scene validate scene.yaml
    ancha run scene.yaml --local -n 3
    ancha baseline save before

The first run exits 1: muted_staging_only fails in all three trials. The agent finds the staging monitor but sends the downtime without its monitor_id, and a downtime with no monitor_id silences every monitor, production included. Change `{ scope: ['*'] }` to `{ scope: ['*'], monitor_id: staging.id }` in agent.mjs, then:

    ancha run scene.yaml --local -n 3 --compare before

The second run exits 0: one 30-minute downtime on the staging monitor, and nothing on production. This deterministic fixture tests one downtime request. Keep the checks unchanged while fixing the agent.
