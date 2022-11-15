import Layout from "../components/layout/Layout";

// ES2022 @start: Imports
import React from 'react';
import {useMoralis, useMoralisQuery, useMoralisWeb3Api} from 'react-moralis';
import NFTCard from '../components/nfts/NFTCard';
import {convertNFTs} from '../utils/converters';
// ES2022 @end: Imports

// ES2022 @start: hardcoded settings
// ES2022 @end: hardcoded settings

function Bill() {
  // ES2022 @start: Settings
  const [nfts, setNfts] = React.useState([]);
  const [initNfts, setInitNfts] = React.useState([]);
  const [collections, setCollections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filteredCollection, setFilteredCollection] = React.useState();
  const Web3Api = useMoralisWeb3Api();
  const {user, isAuthenticated, isInitialized} = useMoralis();
  const moralisCollections = useMoralisQuery("NFTCollections");
  const moralisNFTs =  useMoralisQuery("NFTDetails");

  // ES2022: method to get collections from Moralis DB
  const getCollections = async () => {
    return await moralisCollections.fetch().then(response => {
      const mappedResponse = response.map(collection => {
        return {
          name: collection.get('name'),
          token_address: collection.get('token_address'),
          sorting: collection.get('sorting'),
        }
      }).sort((a, b) => (a.sorting - b.sorting));

      setCollections(mappedResponse);
      return mappedResponse;
    });
  }

  const getMasterNFTs = async () => {
    const options = {
      chain: process.env.NEXT_PUBLIC_MORALIS_POLYGON,
      address: process.env.NEXT_PUBLIC_MARTEX_OWNER,
    };

    const polygonNFTs = await Web3Api.account.getNFTs(options);
    return polygonNFTs.result;
  };

  const initial = async () => {
    setIsLoading(true);
    const masterNftsRes = await getMasterNFTs();

    const cols = await getCollections();

    let tmpNFTs = [];
    for (let col of cols) {
      const options = {
        address: col?.token_address,
        chain: process.env.NEXT_PUBLIC_MORALIS_POLYGON,
      };

      try {
        await Web3Api.token.getAllTokenIds(options).then(async response => {
          const nfts = response.result;
          const results = await moralisNFTs.fetch();

          const mappedResults = convertNFTs(results);
          const mapped = nfts.map(nft => {
            const found = mappedResults.find(f => f.token_id === nft.token_id && f.token_address.toLowerCase() === nft.token_address.toLowerCase());
            const master = masterNftsRes.find(m => m.token_id === nft.token_id && m.token_address.toLowerCase() === nft.token_address.toLowerCase())

            return {
              ...nft,
              ...found,
              available: master?.amount || 0,
            };
          }).filter(el => el?.sale).sort((a,b) => (b.token_id-a.token_id));

          tmpNFTs = [...tmpNFTs, ...mapped];
        });
      } catch (e) {
        console.log(e);
      }
    }

    setNfts(tmpNFTs);
    setInitNfts(tmpNFTs);
    setIsLoading(false);
  }

  React.useEffect(() => {
    if (isInitialized) {
      initial();
    }
  }, [isInitialized]);

  React.useEffect(() => {
    if (filteredCollection) {
      setNfts(ns => ns.filter(n => n.token_address === filteredCollection.token_address));
    } else {
      setNfts(initNfts);
    }
  }, [filteredCollection]);

    return (
        <>
            <Layout
                headTitle="Collections"
                pageTitle="Collections"
                pageTitleSub={"Welcome NFT Collections page"}
                pageClass={"dashboard"}
                parent={"Home"}
                child={"Collection"}
            >

                <div className="col-12">
                        <div className="card filter-tab">
                            <div className="card-header">
                                <div className="filter-nav">
                                  <a className={!filteredCollection ? 'active' : ''} onClick={() => setFilteredCollection()}>All</a>
                                  {collections.map((c, index) => (
                                    <a
                                      onClick={() => setFilteredCollection(c)}
                                      className={filteredCollection && filteredCollection.token_address === c.token_address ? 'active' : ''}
                                      key={index}>{c.name}</a>
                                  ))}
                                </div>
                            </div>
                            <div className="card-body bs-0 p-0 bg-transparent">
                              {isLoading ? (
                                <div className="spinner-border text-light" role="status" />
                              ) : (
                                <div className="row">
                                  {/* ES2022: Use NFTCard to get the right style for a listed item*/}
                                  {nfts.map((nft, index) => (<NFTCard item={nft} collections={collections} key={index}/>))}
                                </div>
                              )}
                            </div>
                        </div>
                    </div>
            </Layout>
        </>
    );
}
export default Bill;
