# Reconstruct a support failure

Fictional, normalized trace records. No real incident or customer data.

Requires Node.js 24 and @ancha-labs/cli 0.4.3. The bot uses Node's built-in fetch, no model and no Slack account.

In this directory:

    ancha init --agent "node bot.mjs"
    ancha scene validate scene.yaml
    ancha run scene.yaml --local -n 3
    ancha explain latest --trial 1
    ancha baseline save before

The first run exits 1: posted_a_reply passes, answered_newest fails in all three trials. Change `messages.findLast(` to `messages.find(` in bot.mjs, then:

    ancha run scene.yaml --local -n 3 --compare before

The second run exits 0: both required checks pass in all three trials. This deterministic fixture tests one thread-selection bug. Timestamps and run IDs in CLI output vary. Keep checks unchanged while fixing the bot.
