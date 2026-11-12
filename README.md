# Ancha examples

Tests for AI agents, run against stateful replicas of the tools the agents call. Each folder holds a fictional
situation, a scripted agent that makes one mistake, the checks that catch it and the results of three recorded trials.
Every run here was recorded with [@ancha-labs/cli](https://www.npmjs.com/package/@ancha-labs/cli) 0.4.6 on Node.js 24.

    npm install -g @ancha-labs/cli@0.4.6

## Examples

| Folder | The mistake | More |
|---|---|---|
| [stripe-duplicate-refund](stripe-duplicate-refund) | Refunds a payment that was already refunded | [Stripe](https://ancha.io/tools/stripe) |
| [zendesk-wrong-ticket](zendesk-wrong-ticket) | Replies on the newest ticket, not the one the customer asked about | [Zendesk](https://ancha.io/tools/zendesk) |
| [jira-duplicate-bug](jira-duplicate-bug) | Files a second bug for one that is already open | [Jira](https://ancha.io/tools/jira) |
| [github-red-ci](github-red-ci) | Merges a pull request whose test check failed | [GitHub](https://ancha.io/tools/github) |
| [pagerduty-wrong-incident](pagerduty-wrong-incident) | Acknowledges a colleague's incident and leaves its own page ringing | [PagerDuty](https://ancha.io/tools/pagerduty) |
| [datadog-global-mute](datadog-global-mute) | Schedules a downtime that silences every monitor, production included | [Datadog](https://ancha.io/tools/datadog) |
| [trace-reconstruction](trace-reconstruction) | A Slack bot answers an older message instead of the newest | [From traces to a test environment](https://ancha.io/blog/reconstruct-test-environments-from-traces) |
| [refund-trace-import](refund-trace-import) | A production trace, imported: a refund on another customer's order | [Langfuse, LangSmith and Braintrust](https://ancha.io/blog/langfuse-langsmith-braintrust-and-ancha) |

In a folder (the agent is `bot.mjs` in trace-reconstruction):

    ancha init --agent "node agent.mjs"
    ancha run scene.yaml --local -n 3

The first run exits 1 on the mistake. The folder's README names the one-line fix, and with it the same run exits 0.
refund-trace-import starts with `ancha import`; its README has the steps.

## Worlds

The worlds behind the guides on [ancha.io/blog](https://ancha.io/blog), one YAML file each: the tools, their seeded
records, the people, the task and the checks.

| World | Tools | Guide |
|---|---|---|
| [support-world.yaml](worlds/support-world.yaml) | Zendesk, Jira, Slack | [Customer support agent](https://ancha.io/blog/how-to-test-a-customer-support-agent) |
| [oncall-world.yaml](worlds/oncall-world.yaml) | PagerDuty, Datadog, Slack, GitHub | [On-call agent](https://ancha.io/blog/how-to-test-an-on-call-agent) |
| [coding-world.yaml](worlds/coding-world.yaml) | GitHub, Linear, Slack | [Coding agent workflow](https://ancha.io/blog/how-to-test-a-coding-agent-workflow) |
| [sales-world.yaml](worlds/sales-world.yaml) | Gmail, Salesforce, HubSpot | [Sales agent](https://ancha.io/blog/how-to-test-a-sales-agent) |
| [billing-support-world.yaml](worlds/billing-support-world.yaml) | Stripe, Zendesk, Gmail | [Billing support agent](https://ancha.io/blog/how-to-test-a-billing-support-agent) |
| [ecommerce-support-world.yaml](worlds/ecommerce-support-world.yaml) | Shopify, Stripe, Zendesk | [E-commerce support agent](https://ancha.io/blog/how-to-test-an-ecommerce-support-agent) |
| [executive-assistant-world.yaml](worlds/executive-assistant-world.yaml) | Google Calendar, Gmail, Slack | [Executive assistant agent](https://ancha.io/blog/how-to-test-an-executive-assistant-agent) |

Start one and point your agent at it:

    ancha world up --scene worlds/oncall-world.yaml

It prints a base URL, credentials and an MCP URL for each tool. When your agent has finished:

    ancha check --env <world id>
    ancha world down --env <world id>

To run your agent three times, each from the seeded state:

    ancha init --agent "node agent.mjs"
    ancha run worlds/oncall-world.yaml --local -n 3

## License

[MIT](LICENSE)
