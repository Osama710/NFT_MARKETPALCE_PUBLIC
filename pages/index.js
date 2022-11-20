import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import Link from "next/link";
import WalletComponent from "../components/moralis/WalletComponent";
import NFTCard from "../components/nfts/NFTCard";
import React from "react";
import {
  useMoralisQuery,
  useNewMoralisObject,
  useMoralisWeb3Api,
  useMoralis,
} from "react-moralis";
import Moralis from "moralis";
import { convertNFTs } from "../utils/converters";
import { resetPassword } from "../utils/moralis";

function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [nfts, setNfts] = React.useState([]);
  const [initNfts, setInitNfts] = React.useState([]);
  const [collections, setCollections] = React.useState([]);
  const Web3Api = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();

  const moralisCollections = useMoralisQuery("NFTCollections");
  const moralisNFTs = useMoralisQuery("NFTDetails");

  // ES2022: method to get collections from Moralis DB
  const getCollections = async () => {
    return await moralisCollections.fetch().then((response) => {
      const mappedResponse = response
        .map((collection) => {
          return {
            name: collection.get("name"),
            token_address: collection.get("token_address"),
            sorting: collection.get("sorting"),
          };
        })
        .sort((a, b) => a.sorting - b.sorting);

      setCollections(mappedResponse);
      return mappedResponse;
    });
  };

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
        await Web3Api.token.getAllTokenIds(options).then(async (response) => {
          const nfts = response.result;
          const results = await moralisNFTs.fetch();
          const mappedResults = convertNFTs(results);
          const mapped = nfts
            .map((nft) => {
              const found = mappedResults.find(
                (f) => f.token_id === nft.token_id
              );
              const master = masterNftsRes.find(
                (m) => m.token_id === nft.token_id
              );

              return {
                ...nft,
                ...found,
                available: master?.amount || 0,
              };
            })
            .filter((el) => el?.sale && el?.featured)
            .sort((a, b) => b.token_id - a.token_id);

          tmpNFTs = [...tmpNFTs, ...mapped];
          // console.log(tmpNFTs,"mfs")
        });
      } catch (e) {
        console.log(e);
      }
    }

    setNfts(tmpNFTs);
    setInitNfts(tmpNFTs);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isInitialized) {
      initial();
    }
  }, [isInitialized]);

  return (
    <>
      <Layout
        headTitle="Dashboard"
        pageTitleSub={"Welcome NFT Dashboard"}
        pageClass={"dashboard"}
        parent={"Home"}
        child={"Dashboard"}
      >
        <div className="row">
          <div className="col-12">
            <div className="promotion d-flex justify-content-between align-items-center">
              <div className="promotion-detail">
                <h3 className="text-white mb-3">
                  Discover and Collect
                  <br />
                  our unique NFTs
                </h3>
                <p>
                  <br />
                  Mars1982's Digital marketplace for crypto collectibles.
                </p>
                <Link href={"collection"}>Explore</Link>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card filter-tab m-0">
              <div className="card-header">
                <h4 className="card-title">Featured NFTs</h4>
              </div>
              <div className="card-body bs-0 p-0 bg-transparent">
                {isLoading ? (
                  <div className="spinner-border text-light" role="status" />
                ) : (
                  <div className="row">
                    {/* ES2022: Use NFTCard to get the right style for a listed item*/}
                    {nfts.map((nft, index) => (
                      <NFTCard
                        item={nft}
                        collections={collections}
                        fetchNFTs={initial}
                        key={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

const mapStateToProps = (state) => ({
  lineData: state.LineChart.expenses,
  doughnutData: state.DoughnutChart.statistics,
});
export default connect(mapStateToProps, {})(Home);
