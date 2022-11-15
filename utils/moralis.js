import Moralis from 'moralis';
import axios from 'axios';

// use as () => resetPassword('elvissalaris+999@gmail.com')
export const resetPassword = async (email) => {
  Moralis.User.requestPasswordReset(email)
    .then(() => {
      // Password reset request was sent successfully
    })
    .catch((error) => {
      // Show the error message somewhere
      alert("Error: " + error.code + " " + error.message);
    });
}

const createPurchase = async (nft) => {
  await Moralis.enableWeb3();

  const currentUser = Moralis.User.current();

  if (!currentUser || !nft) {
    return null;
  }

  try {
    const mObject = Moralis.Object.extend('TransactionForNFT');
    const transactionObject = new mObject();
    transactionObject.set('nft_id', nft?.id);
    transactionObject.set('user_id', currentUser?.id);
    transactionObject.set('status', 0);
    await transactionObject.save();
    return transactionObject;
  } catch (e) {
    console.log(e);
  }

  return null;
}

export const initPurchase = async (nft) => {
  const transactionObject = await createPurchase(nft);

  if (transactionObject) {
    const options = {
      type: "erc20",
      amount: Moralis.Units.Token(nft?.price, "18"),
      receiver: process.env.NEXT_PUBLIC_MARTEX_OWNER,
      contractAddress: process.env.NEXT_PUBLIC_MARTEX_ADDRESS,
    };

    let transaction = await Moralis.transfer(options);
    transactionObject.set('hash', transaction.hash);
    await transactionObject.save();

    const result = await transaction.wait();
    if (result?.status === 1) {
      transactionObject.set('status', 1);
      await transactionObject.save();
      const buy = await axios.post('/api/moralis', { method: 'buyNFT', data: { nft, transaction_hash: result?.transactionHash }});

      return buy;
    }
  }

  return null;
}

export const initPurchaseStripe = async (nft) => {
  const transactionObject = await createPurchase(nft);

  if (transactionObject) {
    try {
      const session = await axios.post('/api/create-payment', { nft: { name: nft.name, price: nft.price}});
      const {payment_intent, url} = session.data;

      transactionObject.set('hash', payment_intent);
      await transactionObject.save();

      window.location.replace(url);
      return payment_intent;
    } catch(e) {
      console.log(e);
    }

    return null;
  }

  return null;
}
