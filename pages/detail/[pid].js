import React from "react";
import Layout from "../../components/layout/Layout";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Moralis from "moralis";
import { convertNFTs } from "../../utils/converters";
import { initPurchase, initPurchaseStripe } from "../../utils/moralis";

const Detail = () => {
  const { isAuthenticated, user, isInitialized, Moralis } = useMoralis();
  const [nft, setNft] = React.useState();
  const [collection, setCollection] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  let c = 1;

  const Web3Api = useMoralisWeb3Api();
  const router = useRouter();

  const { pid } = router.query;

  useEffect(() => {
    if (router.query?.referral) {
      referralSet(router.query.referral);
    }
  }, [router?.query]);

  const firstFunc = async () => {
    const NFTDetails = await Moralis.Object.extend("NFTDetails");
    const query = await new Moralis.Query(NFTDetails);
    query
      .equalTo("objectId", pid)
      .find()
      .then(async (response) => {
        const mapped = convertNFTs(response);
        if (mapped.length) {
          const options = {
            chain: process.env.NEXT_PUBLIC_MORALIS_POLYGON,
            address: process.env.NEXT_PUBLIC_MARTEX_OWNER,
          };

          const resNft = mapped[0];
          const polygonNFTs = await Web3Api.account.getNFTs(options);
          const master = polygonNFTs?.result?.find(
            (m) => m?.token_id === resNft.token_id
          );
          resNft.available = master?.amount || 0;
          setNft(resNft);
          getCollection(resNft.token_address);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // if (isInitialized) {
    setIsLoading(true);
    setTimeout(() => {
      if (c === 1) {
        c = c + 1;
        firstFunc();
      }
    }, 2000);
    // }
  }, []);

  const getCollection = async (tokenAddress) => {
    const NFTCollections = await Moralis.Object.extend("NFTCollections");
    const query = new Moralis.Query(NFTCollections);

    return await query
      .equalTo("token_address", tokenAddress)
      .find()
      .then(async (response) => {
        const mappedResponse = response
          .map((collection) => {
            return {
              name: collection.get("name"),
              token_address: collection.get("token_address"),
              sorting: collection.get("sorting"),
            };
          })
          .sort((a, b) => a.sorting - b.sorting);

        if (mappedResponse.length) {
          setCollection(mappedResponse[0]);
        }
      });
  };

  const buyNow = async (stripe = false) => {
    setLoading(true);
    try {
      if (stripe) {
        await initPurchaseStripe(nft);
      } else {
        await initPurchase(nft);
      }
    } catch (e) {
      // whatever
    }
    setLoading(false);
    if (nfts) {
      fetchNFTs();
    }
  };

  const buyButtons = () => {
    return (
      <div>
        <button
          className="btn btn-success btn-lg d-flex align-items-center justify-content-center"
          onClick={() => buyNow(false)}
          disabled={!nft?.sale || nft.available < 1}
        >
          Buy now with MARTEX&nbsp;
          {loading && (
            <div className="spinner-border text-light" role="status" />
          )}
        </button>
        <button
          className="btn btn-primary btn-lg d-flex align-items-center justify-content-center mt-2"
          onClick={() => buyNow(true)}
          disabled={!nft?.sale || nft.available < 1}
        >
          Buy now with USD&nbsp;
          {loading && (
            <div className="spinner-border text-light" role="status" />
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      <Layout
        headTitle={"Detail"}
        pageTitle={"Detail"}
        pageTitleSub={nft?.name || "-/-"}
        pageClass={"dashboard"}
        parent={"Home"}
        child={"Collection"}
      >
        {isLoading ? (
          <div className="spinner-border text-light" role="status" />
        ) : (
          nft && (
            <div className="row">
              <div className="col-xxl-8 col-xl-12">
                <div className="card">
                  <div className="card-body">
                    <div className="prod-slider-main">
                      <div className="prod-slider-head">
                        <h4>{nft?.name}</h4>
                        <h6>
                          <span>
                            {nft?.available} of {nft?.quantity} left
                          </span>
                        </h6>
                      </div>
                      {nft?.token_address} / {nft?.token_id}
                      <img
                        src={nft?.image_uri}
                        className={
                          "rounded mx-auto d-block rounded img-wrap mt-5"
                        }
                        width={"100%"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-12">
                <div className="card welcome-Detail">
                  <div className="card-body prod-price-wid">
                    <h4>
                      <span>{nft?.price} MARTEX</span>
                    </h4>
                    <span className="qty">
                      {nft?.available} of {nft?.quantity} left
                    </span>
                    {buyButtons()}
                  </div>
                  <div className="card">
                    <div className="abt-game">
                      <h3>About This NFT</h3>

                      <div className="row">
                        <div className="col">
                          <p>{nft?.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </Layout>
    </>
  );
};
export default Detail;
