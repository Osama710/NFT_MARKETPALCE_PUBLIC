export const isSuperAdmin = (userAddress) => {
  return userAddress?.id === process.env.NEXT_PUBLIC_MORALIS_SUPER_ADMIN;
}

export const exchange = 1.04107;

export const moneyFormatMartexToDollar = (martex) => {
  let num = 0;
  if (martex > 0) {
    num = Math.ceil(martex * exchange * 100) * 0.01;
  }
  const numString = num.toLocaleString(undefined,{ style: 'decimal', maximumFractionDigits : 2, minimumFractionDigits : 2 });
  return `$${numString}`;
}

export const truncate = (input, size = 120) => input && input.length > size ? `${input.substring(0, size)}...` : input;

export const convertNFTs = (results = []) => {
  return results.map(r => ({
    ...r,
    quantity: r.get('quantity'),
    token_address: r.get('token_address'),
    token_id: r.get('token_id'),
    price: r.get('price'),
    image_thumb_uri: r.get('image_thumb_uri'),
    image_uri: r.get('image_uri'),
    name: r.get('name'),
    sale: r.get('sale'),
    featured: r.get('featured'),
    description: r.get('description'),
  }));
}

export const displayAddress = (address, long = false) => {
  if (!address) {
    return '';
  }

  if (long && address.length < 24) {
    return address;
  }

  const i = long ? 24 : 5;
  const j = long ? 8 : 4;

  const prefix = address.substring(0, i);
  const suffix = address.substring(address.length - j);

  return `${prefix}...${suffix}`;
}


export const addPolygonNetwork = () => {
  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'Polygon MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com']
    }]
  }).catch((error) => {
    console.log(error)
  });
}

export const addMartexToken = () => {
  window.ethereum
    .request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: process.env.NEXT_PUBLIC_MARTEX_ADDRESS,
          symbol: 'MARTEX',
          decimals: 18,
          image: 'https://app.mars1982.com/images/apple-touch-icon.png',
        },
      },
    })
    .then((success) => {
      if (success) {
        console.log('MARTEX successfully added to wallet!');
      } else {
        throw new Error('Something went wrong.');
      }
    })
    .catch(console.error);
}
