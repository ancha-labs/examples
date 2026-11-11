// A refund agent, scripted (no model): it reads the order id from the customer's message, looks the order up and
// refunds it.
import { wrapTools, entry } from '@ancha-labs/tools';
import { lookupOrder, refundOrder } from './orders.mjs';

const tools = wrapTools({ lookup_order: lookupOrder, refund_order: refundOrder });

await entry(async (input) => {
  const orderId = input.messages.at(-1).content.match(/A-\d+/)[0];
  const order = await tools.lookup_order({ order_id: orderId });
  const refund = await tools.refund_order({ order_id: order.order_id });
  return `I've refunded $${refund.amount.toFixed(2)} for order ${orderId}.`;
});
