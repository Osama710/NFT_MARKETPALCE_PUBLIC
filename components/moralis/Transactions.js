import React from 'react';
import Moralis from 'moralis';
import {useMoralis} from 'react-moralis';
import axios from 'axios';
import {useDeviceSelectors} from 'react-device-detect';

const Transactions = (props) => {
  const {isAuthenticated, user, isWeb3Enabled, enableWeb3} = useMoralis();
  const [purchases, setPurchases] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [globalLoading, setGlobalLoading] = React.useState(false);
  let isMobile = false;
  if (typeof window !== "undefined") {
    const nav = window?.navigator?.userAgent;
    const [selectors, data] = useDeviceSelectors(nav);
    isMobile = selectors.isMobile;
  }

  React.useEffect(() => {
    if (!isWeb3Enabled && isAuthenticated) {
      enableWeb3({ provider: isMobile ? "walletconnect" : 'metamask' });
    }
  }, [isWeb3Enabled, isAuthenticated]);

  const switchStatus = (status) => {
    switch (status) {
      case 0: return 'in progress';
      case 1: return 'successful';
      case 2: return 'in wallet';
      default: return 'in progress';
    }
  }

  const switchStatusColor = (status) => {
    switch (status) {
      case 0: return 'danger';
      case 1: return 'success';
      case 2: return 'primary';
      default: return 'danger';
    }
  }


  const init = () => {
    if (isAuthenticated && user?.id) {
      setGlobalLoading(true);
      try {
        const Purchases = Moralis.Object.extend("TransactionForNFT");
        const query = new Moralis.Query(Purchases);
        query.equalTo("user_id", user.id);
        query.find().then(async response => {
          const nfts = [];
          for (let r of response) {
            const NFT = Moralis.Object.extend("NFTDetails");
            const query2 = new Moralis.Query(NFT);
            query2.equalTo("objectId", r.get('nft_id'));
            const nft = await query2.first();
            nfts.push({
              nft_id: nft.id,
              name: nft.get('name'),
              price: nft.get('price'),
            });
          }

          const mappedResponse = response.map(collection => {
            const nft = nfts.find(n => n.nft_id === collection.get('nft_id'));

            return {
              nft_id: collection.get('nft_id'),
              hash: collection.get('hash'),
              status: collection.get('status'),
              createdAt: collection.get('createdAt'),
              updatedAt: collection.get('updatedAt'),
              nft,
            }
          }).sort((a, b) => (b?.updatedAt - a?.updatedAt));

          setGlobalLoading(false);
          setPurchases(mappedResponse);
        });
      } catch (e) {
        console.log(e);
        setGlobalLoading(false);
      }
    }
  };

  React.useEffect(() => {
    init()
  }, [user, props?.refresh]);

  const completeTransfer = async (purchase) => {
    setLoading(true);
    try {
      await axios.post('/api/moralis', { method: 'buyNFT', data: { nft: {id: purchase.nft_id}, transaction_hash: purchase.hash }});
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    init();
  }

  if (!purchases || !isAuthenticated) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Your Transactions</h4>
      </div>
      <div className="card-body p-4">
          <ul className="list-group">
            {!globalLoading && purchases.map((purchase, index) => (
              <li className={'list-group-item d-flex justify-content-between align-items-start'} key={index}>
                <div className="me-auto">
                  <div className="fw-bold">{purchase?.nft?.name}</div>
                  {purchase?.nft?.price} (MARTEX)
                </div>
                <div className="text-end justify-content-end">
                  <span className={`badge bg-${switchStatusColor(purchase.status)}`}>{switchStatus(purchase.status)}</span>
                  <br />
                  {purchase?.updatedAt?.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                </div>
                {purchase.status === 1 && (
                  <div className="text-end justify-content-end">
                    &nbsp; <button className={'btn btn-primary'} onClick={() => completeTransfer(purchase)}>
                    {loading && (<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>)}
                    &nbsp;TRANSFER</button>
                  </div>
                )}


              </li>
            ))}

            {globalLoading && (<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>)}
            {purchases.length === 0 && (
              <div className={'text-center'}>There are no transactions</div>
            )}
          </ul>
      </div>
    </div>
  );
};

export default Transactions;
