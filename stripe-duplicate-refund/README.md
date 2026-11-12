# Refund a payment once

A fictional Stripe test-mode account, Acme Records. Laura at Pike Street Dental already received her $480 credit on yesterday's $2,000 payment twenty minutes ago; a second customer, Pike Street Dental East, was refunded $150 five minutes ago. No real payment, customer or Stripe account is involved.

Requires Node.js 24 and @ancha-labs/cli 0.4.6. The agent uses Node's built-in fetch, no model and no Stripe key.

In this directory:

    ancha init --agent "node agent.mjs"
    ancha scene validate scene.yaml
    ancha run scene.yaml --local -n 3
    ancha baseline save before

The first run exits 1: looked_for_refunds passes and no_second_refund fails in all three trials. The agent lists only the newest refund on the account, which belongs to the other customer, so it refunds Laura a second time. Change `'refunds?limit=1'` to `` `refunds?payment_intent=${payment.id}` `` in agent.mjs, then:

    ancha run scene.yaml --local -n 3 --compare before

The second run exits 0: the agent finds Laura's earlier refund and makes no second one. This deterministic fixture tests one refund lookup. Keep the checks unchanged while fixing the agent.
