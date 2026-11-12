# Reply on the right ticket

A fictional Zendesk account for Acme. Erin Walsh at Ridgeway Robotics has two open tickets: her monthly CSV export has been empty since Monday, written yesterday, and her invoice shows the wrong billing address, written three hours ago. The agent must tell her on the CSV ticket that the fix ships on Thursday. No real Zendesk account or customer is involved.

Requires Node.js 24 and @ancha-labs/cli 0.4.5. The agent uses Node's built-in fetch, no model and no Zendesk token.

In this directory:

    ancha init --agent "node agent.mjs"
    ancha scene validate scene.yaml
    ancha run scene.yaml --local -n 3
    ancha baseline save before

The first run exits 1: replied_on_the_csv_ticket and left_the_invoice_ticket_alone fail in all three trials. The search returns Erin's newest ticket first, the invoice, and the agent replies on the first result. Change `results[0]` to `results.find(ticket => ticket.subject.includes('CSV'))` in agent.mjs, then:

    ancha run scene.yaml --local -n 3 --compare before

The second run exits 0: the reply is on ticket #4101, and the invoice ticket, #4102, gets none. Keep the checks unchanged while fixing the agent.
