import React from 'react';
import {useMoralis, useMoralisWeb3Api} from 'react-moralis';
import Moralis from 'moralis';
import Link from 'next/link';
import Address from './Address';
import {addMartexToken, addPolygonNetwork, displayAddress} from '../../utils/converters';
import ReactSnackBar from 'react-js-snackbar';
import { useDeviceSelectors } from 'react-device-detect';

const imageMM = () => (<img src={'/images/metamask-fox.svg'} height={32}/>);
const imageWC = () => (<img src={'/images/walletconnect-circle-blue.png'} height={32}/>);

const WalletComponent = ({ mini, refresh, setRefresh }) => {
  const {isAuthenticated, user, authenticate} = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const [isMobileB, setIsMobileB] = React.useState(false);
  let isMobile = false;
  if (typeof window !== "undefined") {
    const nav = window?.navigator?.userAgent;
    const [selectors, data] = useDeviceSelectors(nav);
    isMobile = selectors.isMobile;
  }
  React.useEffect(() => {
    setIsMobileB(isMobile);
  }, []);

  const [showPass, setShowPass] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [copied, setCopied] = React.useState([false, false]);
  const [purchases, setPurchases] = React.useState([]);
  const [walletMartex, setWalletMartex] = React.useState(0);
  const [error, setError] = React.useState();
  const [success, setSuccess] = React.useState(false);

  const fetchTokenBalances = async () => {
    if (isAuthenticated && user?.id) {
      const options = {
        chain: process.env.NEXT_PUBLIC_MORALIS_POLYGON,
        address: user?.get('ethAddress'),
      };

      let balances = await Web3Api.account.getTokenBalances(options);

      setWalletMartex(balances?.find((balance) => balance.token_address === process.env.NEXT_PUBLIC_MARTEX_ADDRESS.toLowerCase())?.balance || 0);
    }
  };

  const checkIfAccountLinked = () => {
    if (isAuthenticated) {
      const accountLinked = user?.attributes?.accounts?.includes(
        user.get('ethAddress')
      );

      return !!accountLinked;
    }

    return false;
  }

  React.useEffect(() => {
    if (copied.some(i => i === true)) {
      const timer = setTimeout(() => setCopied([false, false]), 1500);

      return () => clearTimeout(timer);
    }
  }, [copied]);

  React.useEffect(() => {
    if (checkIfAccountLinked()) {
      fetchTokenBalances();
    }
  }, [checkIfAccountLinked()]);

  const copyToClipboard = (str, index) => {
    navigator.clipboard.writeText(str);
    let tmp = [false, false];
    tmp[index] = true;
    setCopied(tmp);
  };

  const connectWallet = async (provider = 'metamask') => {
    if (!checkIfAccountLinked()) {
      setIsLoading(true);
      try {
        await Moralis.enableWeb3({ provider });
        await Moralis.link(user.get('ethAddress'));
      } catch (e) {
        console.log(e.message);
      }

      setIsLoading(false);
    }
  }

  const transferTokens = async () => {
    setIsLoading(true);
    try {
      const tr = await Moralis.Cloud.run("safeTransferTo");

      if (tr?.status) {
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Something went wrong, please try again later.');
      }
    } catch (e) {
      setError('Something went wrong, please try again later.');
      console.log('error', e);
    }

    fetchPurchases();
    fetchTokenBalances();

    setRefresh(refresh + 1);
    setIsLoading(false);
  }

  const fetchPurchases = () => {
    if (isAuthenticated && user?.id) {
      const Purchases = Moralis.Object.extend("Purchases");
      const query = new Moralis.Query(Purchases);
      query.equalTo("user_id", user.id);
      query.find().then(response => {
        const mappedResponse = response.map(collection => {
          return {
            martex: collection.get('martex'),
            exchange: collection.get('exchange'),
            amount: collection.get('amount_total'),
            status: collection.get('status'),
            createdAt: collection.get('createdAt'),
            updatedAt: collection.get('updatedAt'),
          }
        }).sort((a, b) => (b.updatedAt - a.updatedAt));

        setPurchases(mappedResponse);
      });
    }
  }

  React.useEffect(() => {
    // fetchPurchases();
    fetchTokenBalances();
  }, [user, refresh]);

  if (!isAuthenticated) {
    return null;
  }

  if (mini) {
    return (
      <div className="card">
        <div className="card-body p-4 mb-5">
          <h4 className="me-auto border-bottom">
            Wallet
          </h4>
          <h6 className={'me-auto'}>
            <Address address={user?.get('ethAddress')} />
          </h6>
          <Link href={'/profile'}>
            <>
              <div className={'d-flex justify-content-between me-auto'}>Amount in wallet: </div>
              {/* <strong>{Moralis.Units.FromWei(walletMartex || 0)} (MARTEX)</strong> */}
            </>
          </Link>
        </div>
      </div>
    );
  }

  const accountLinkedSection = () => {
    if (checkIfAccountLinked()) {
      return (<div>
        <h3>Wallet</h3>
        <h6>
          <Address address={user?.get('ethAddress')} />
        </h6>
        <div className={'d-grid gap-2 mt-3 mb-3'}>
          <button className={'btn btn-lg btn-success'} onClick={addPolygonNetwork}>Add Polygon Chain</button>
          <button className={'btn btn-lg btn-primary'} onClick={addMartexToken}>Add Mars1982 Coin</button>
        </div>
        <div className={'d-flex justify-content-between'}>Amount in wallet: </div>
        {/* <strong>{Moralis.Units.FromWei(walletMartex || 0)} (MARTEX)</strong> */}
      </div>);
    }

    return (
      <>
        <h4>Import your wallet!</h4>
        <p>Your wallet <strong>{displayAddress(user?.get('ethAddress'))}</strong> is not connected yet</p>
        <ul>
          <li>1. Download and install <a href={'https://metamask.io/download/'} target={'_blank'}>Metamask</a> or <a href={'https://walletconnect.com/'} target={'_blank'}>WalletConnect</a></li>
          <li>2. Click on <strong>Import Account</strong></li>
          <li>3. Select type <strong>Private key</strong></li>
          <li>4. Come back here and click on <strong>Add Polygon Network</strong></li>
          <li>5. Add Mars1982 Coin to your <strong>Wallet</strong></li>
          <li>6. Connect the wallet and sign with <strong>Link... </strong></li>
        </ul>
        <h6 className={'mt-3'}>Wallet address:</h6>
        <Address address={user?.get('ethAddress')} />
        <h6 className={'mt-3'}>Wallet privateKey:</h6>
        <div className="input-group mb-3">
          <input type={showPass ? 'text' : 'password'} value={user?.get('pass')} className="form-control" disabled />
          <button className={`btn ${copied[0] ? 'btn-success' : 'btn-outline-primary'}`} onClick={() => copyToClipboard(user?.get('pass'), 0)}><i className={`${copied[0] ? 'ri-checkbox-multiple-fill' : 'ri-checkbox-multiple-blank-fill'}`} /></button>
          <button className={`btn ${!showPass ? 'btn-outline-primary' : 'btn-primary'}`} onClick={() => setShowPass(!showPass)}><i className={showPass ? 'ri-eye-off-line' : 'ri-eye-line'} /></button>
        </div>
        <h6 className={'mt-3'}>Wallet passphrase:</h6>
        <div className="input-group mb-3">
          <input type={showPass ? 'text' : 'password'} value={user?.get('passphrase')} className="form-control" disabled />
          <button className={`btn ${copied[1] ? 'btn-success' : 'btn-outline-primary'}`} onClick={() => copyToClipboard(user?.get('passphrase'), 1)}><i className={`${copied[1] ? 'ri-checkbox-multiple-fill' : 'ri-checkbox-multiple-blank-fill'}`} /></button>
          <button className={`btn ${!showPass ? 'btn-outline-primary' : 'btn-primary'}`} onClick={() => setShowPass(!showPass)}><i className={showPass ? 'ri-eye-off-line' : 'ri-eye-line'} /></button>
        </div>
        <div className={'d-grid gap-2 mt-4'}>
          <button className={'btn btn-lg btn-success'} onClick={addPolygonNetwork}>Add Polygon Chain</button>
          <button className={'btn btn-lg btn-primary'} onClick={addMartexToken}>Add Mars1982 Coin</button>

          {error && (<div className={'text-danger mt-2'} key={index}>{error}</div>)}
          {!isMobileB && (<button className={'btn btn-outline-primary btn-lg'} onClick={connectWallet}>
            {isLoading && (<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>)}
            Link Metamask {imageMM()}
          </button>)}
          <button className={'btn btn-outline-primary btn-lg'} onClick={() => connectWallet('walletconnect')}>
            {isLoading && (<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>)}
            Link WalletConnect {imageWC()}
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="card">
      <div className="card-body p-4">
        {accountLinkedSection()}
        <ReactSnackBar Icon={<i className="ri-checkbox-line"></i>
        } Show={success}>
          Transaction completed!
        </ReactSnackBar>
      </div>
    </div>
  );
};

export default WalletComponent;
