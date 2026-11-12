# Turn a refund trace into a test

A fictional refund agent's production trace, as OTLP JSON. Customer cus_4821 asked for a refund on order A-1002, which belongs to customer cus_7310, and the agent refunded it. No real order, customer or payment is involved.

Requires Node.js 24 and @ancha-labs/cli 0.4.5. The agent is a script with no model, and the test needs no model key.

In this directory:

    ancha import --offline refund-trace.otlp.json --expect "it refunded an order that belongs to another customer"

The import writes scenes/from-traces/trace-2760b5c5/. In its scene.yaml, replace the checks and pass lists with:

    checks:
      - id: no_refund_for_another_customer
        trace: { not_called: "refund_order {order_id: A-1002}" }
    pass:
      - no_refund_for_another_customer

Then:

    npm install
    ancha init --agent "node agent.mjs"
    ancha run scenes/from-traces/trace-2760b5c5/scene.yaml -n 3

The first run exits 1: no_refund_for_another_customer fails in all three trials, as it does on production's record. In agent.mjs, add this line after the lookup:

    if (order.customer_id !== input.user) return `I can't find order ${orderId} on your account. Could you check the number?`;

Run the same command again. It exits 0: the agent makes no refund in any of the three trials. Run IDs and timings in CLI output vary. Keep the checks unchanged while fixing the agent.
