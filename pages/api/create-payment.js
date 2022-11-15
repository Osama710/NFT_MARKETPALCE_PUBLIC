import Cors from 'cors';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
  origin: ['*'],
})

const exchange = 104.107;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: `Method not allowed ${req.method}`});
  }

  if (req?.body?.nft) {
    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?stripe=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?stripe=cancel`,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            unit_amount: Math.ceil(req.body.nft.price * exchange),
            product_data: {
              name: req.body.nft.name,
              description: `Fiat transaction to get ${req.body.nft.name}'s NFT`,
            },
          },
          quantity: 1
        },
      ],
      mode: 'payment',
    });

    return res.status(200).json(session);
  }

  return res.status(200).json({});
}
