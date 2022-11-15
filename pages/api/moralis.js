const Moralis = require("moralis");

Moralis.start({ serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER_URL, appId: process.env.NEXT_PUBLIC_MORALIS_APP_KEY });

export default async function handler(req, res) {
  if (req?.body?.method && req?.body?.data) {
    try {
      const result = await Moralis.Cloud.run(req.body.method, { ...req.body.data, key: process.env.MORALIS_WALLET_KEY });
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  return res.status(500).json({});
}
