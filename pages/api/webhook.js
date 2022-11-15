import { buffer } from 'micro';
import axios from 'axios';
const Moralis = require("moralis");
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

Moralis.start({ serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER_URL, appId: process.env.NEXT_PUBLIC_MORALIS_APP_KEY });

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: `Method not allowed ${req.method}`});
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}`});
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_succeeded':
      const success = event.data.object;
      // console.log(success)
      break;
    case 'checkout.session.async_payment_failed':
      const failure = event.data.object;
      // console.log(failure)

      break;
    case 'checkout.session.completed':
      const session = event.data.object;
      const {payment_intent, payment_status, status} = session;

      if (status === 'complete' && payment_status === 'paid') {
        const Purchase = Moralis.Object.extend("TransactionForNFT");
        const query = new Moralis.Query(Purchase);
        query.equalTo("hash", payment_intent);
        const result = await query.first();
        if (result) {
          result.set("status", 1);
          await result.save();
        }

        await axios.post('/api/moralis', { nft: { id: result.get('nft_id') }, transaction_hash: payment_intent });
      }

      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // console.log(paymentIntent)

      break;
    case 'charge.captured':
      const charge = event.data.object;
      // console.log(charge)

      break;
    default: break;
  }

  return res.status(200).json({});
}
