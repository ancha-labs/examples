# Acknowledge the right incident

A fictional PagerDuty account for Acme. Two incidents are open: Checkout API, triggered twelve minutes ago from staging, and Orders API, triggered two minutes ago because requests are waiting for database connections. The agent is on call for the Orders API. No real PagerDuty account is involved.

Requires Node.js 24 and @ancha-labs/cli 0.4.6. The agent uses Node's built-in fetch, no model and no PagerDuty token.

In this directory:

    ancha init --agent "node agent.mjs"
    ancha scene validate scene.yaml
    ancha run scene.yaml --local -n 3
    ancha baseline save before

The first run exits 1: acked_orders and left_checkout_alone fail in all three trials. The agent takes the first triggered incident, the older Checkout one, acknowledges it and leaves the Orders page ringing. Change `incidents[0]` to `incidents.find(incident => incident.service.summary === 'Orders API')` in agent.mjs, then:

    ancha run scene.yaml --local -n 3 --compare before

The second run exits 0: the Orders incident is acknowledged with a note, and the Checkout incident is still triggered. This deterministic fixture tests one incident choice. Keep the checks unchanged while fixing the agent.
