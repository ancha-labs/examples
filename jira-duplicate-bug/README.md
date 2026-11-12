# Escalate a ticket without filing a duplicate bug

A fictional Acme with Zendesk and Jira in one world. Zendesk ticket #4101, from Erin Walsh at Ridgeway Robotics, says the monthly CSV export is empty. In Jira, project OPS already has the bug: OPS-2, "CSV export returns an empty file", In Progress with Rachel Moore, next to OPS-1, an SSO bug in To Do. The agent must comment on the open bug, or file one if there is none, and note the issue key on the ticket. No real Zendesk or Atlassian account is involved.

Requires Node.js 24 and @ancha-labs/cli 0.4.6. The agent uses Node's built-in fetch, no model, and no Zendesk or Jira token.

In this directory:

    ancha init --agent "node agent.mjs"
    ancha scene validate scene.yaml
    ancha run scene.yaml --local -n 3
    ancha baseline save before

The first run exits 1: searched_for_the_bug passes, and filed_no_duplicate and commented_on_the_open_bug fail in all three trials. The agent searches for bugs in To Do, finds none, and files a second bug. Change `status = "To Do"` to `statusCategory != Done` in agent.mjs, then:

    ancha run scene.yaml --local -n 3 --compare before

The second run exits 0: the agent comments on OPS-2 and files nothing. Keep the checks unchanged while fixing the agent.
