import Cors from 'cors';
const fileGetContents = require('file-get-contents');

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
  origin: ['*'],
});

function urlEncodeLikePHP(str) {
  return encodeURIComponent(str).replace(/[.!~*'()]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: `Method not allowed ${req.method}`});
  }

  if (req?.body?.url) {
    const url = await fileGetContents(`https://cutt.ly/api/api.php?key=${process.env.NEXT_PUBLIC_CUTTLY_API_KEY}&short=${urlEncodeLikePHP(req.body.url)}&noTitle=1`)
    return res.status(200).json(url);
  }

  return res.status(200).json({});
}
