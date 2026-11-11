# Merge the revert only when CI is green

A fictional repository, acme/orders. Ben Carter opened pull request #12 to revert yesterday's cut of the database pool from 40 to 8. Its lint check passed and its test check failed. No real repository or GitHub account is involved.

Requires Node.js 24 and @ancha-labs/cli 0.4.3. The agent uses Node's built-in fetch, no model and no GitHub token.

In this directory:

    ancha init --agent "node agent.mjs"
    ancha scene validate scene.yaml
    ancha run scene.yaml --local -n 3
    ancha baseline save before

The first run exits 1: not_merged and said_why fail in all three trials. The agent treats one passing check run as a green build, merges the pull request and says nothing. Change `runs.some(` to `runs.every(` in agent.mjs, then:

    ancha run scene.yaml --local -n 3 --compare before

The second run exits 0: the pull request stays open and the agent comments that the test check failed. This deterministic fixture tests one merge decision. Keep the checks unchanged while fixing the agent.
