import Layout from "../components/layout/Layout";

// ES2022 @start: Imports
import React from "react";
import { useMoralis, useMoralisQuery, useMoralisWeb3Api } from "react-moralis";
import NFTCard from "../components/nfts/NFTCard";
import { convertNFTs } from "../utils/converters";
import ReactPaginate from "react-paginate";
// import ModalPopup from "../components/elements/ModalPopup";
// ES2022 @end: Imports

// ES2022 @start: hardcoded settings
// ES2022 @end: hardcoded settings

function Bill() {
  // ES2022 @start: Settings
  let itemsPerPage = 8;
  const [nfts, setNfts] = React.useState([]);
  const [initNfts, setInitNfts] = React.useState([]);
  const [currentItems, setCurrentItems] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [collections, setCollections] = React.useState([]);

  // const [modalShow, setModalShow] = React.useState(false);
  const [itemOffset, setItemOffset] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(false);
  const [filteredCollection, setFilteredCollection] = React.useState();
  const Web3Api = useMoralisWeb3Api();
  const { user, isAuthenticated, isInitialized } = useMoralis();
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

    if (cols?.length > 0) {
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
                  (f) =>
                    f?.token_id === nft?.token_id &&
                    f?.token_address?.toLowerCase() ===
                      nft?.token_address?.toLowerCase()
                );
                const master = masterNftsRes.find(
                  (m) =>
                    m?.token_id === nft?.token_id &&
                    m?.token_address?.toLowerCase() ===
                      nft?.token_address?.toLowerCase()
                );

                return {
                  ...nft,
                  ...found,
                  available: master?.amount || 0,
                };
              })
              .filter((el) => el?.sale)
              .sort((a, b) => b.token_id - a.token_id);

            tmpNFTs = [...tmpNFTs, ...mapped];
          });
        } catch (e) {
          console.log(e);
        }
      }

      setNfts(tmpNFTs);
      setInitNfts(tmpNFTs);
      setIsLoading(false);
      setFilteredCollection();
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(tmpNFTs?.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(tmpNFTs?.length / itemsPerPage));
    }
  };

  React.useEffect(() => {
    if (isInitialized) {
      initial();
    }
  }, [isInitialized]);

  React.useEffect(() => {
    if (filteredCollection) {
      // setNfts((ns) =>
      //   ns.filter((n) => n.token_address === filteredCollection.token_address)
      // );
      const filter = nfts?.filter(
        (item) => item?.token_address === filteredCollection?.token_address
      );
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(filter?.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(filter?.length / itemsPerPage));
      // setCurrentItems(filter);
      // setPageCount(Math.ceil(filter?.length / itemsPerPage));
    } else {
      // setNfts(initNfts);
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(initNfts?.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(initNfts?.length / itemsPerPage));

      // setCurrentItems(initNfts);
      // setPageCount(Math.ceil(initNfts?.length / itemsPerPage));
    }
  }, [filteredCollection]);

  // const recalling = () => {
  //   getMasterNFTs();
  //   setIsLoading(false);
  // };

  // setInterval(() => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     recalling();
  //   }, 2000);
  // }, 20000);

  // React.useEffect(() => {
  //   const endOffset = itemOffset + itemsPerPage;
  //   setCurrentItems(nfts?.slice(itemOffset, endOffset));
  //   setPageCount(Math.ceil(nfts?.length / itemsPerPage));
  // }, [nfts]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % nfts?.length;
    setItemOffset(newOffset);
    const endOffset = newOffset + itemsPerPage;
    setCurrentItems(nfts?.slice(newOffset, endOffset));
    setPageCount(Math.ceil(nfts?.length / itemsPerPage));
  };

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
          {/* <button
            className="btn btn-outline-primary btn-lg"
            variant="primary"
            onClick={() => setModalShow(true)}
          >
            Information
          </button>
          <ModalPopup show={modalShow} onHide={() => setModalShow(false)} /> */}
          <div className="card filter-tab">
            <div className="card-header">
              <div className="filter-nav">
                <a
                  className={!filteredCollection ? "active" : ""}
                  onClick={() => setFilteredCollection()}
                >
                  All
                </a>
                {collections.map((c, index) => (
                  <a
                    onClick={() => setFilteredCollection(c)}
                    className={
                      filteredCollection &&
                      filteredCollection.token_address === c.token_address
                        ? "active"
                        : ""
                    }
                    key={index}
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="card-body bs-0 p-0 bg-transparent">
              {isLoading ? (
                <div className="spinner_body">
                  <div className="spinner-border text-light" role="status" />
                  <p>Checking Availability of NFTs...</p>
                </div>
              ) : (
                <div className="row">
                  {/* ES2022: Use NFTCard to get the right style for a listed item*/}
                  {currentItems?.map((nft, index) => (
                    <NFTCard
                      item={nft}
                      collections={collections}
                      key={index}
                      initial={initial}
                    />
                  ))}
                  <div>
                    <ReactPaginate
                      nextLabel="next"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      pageCount={pageCount}
                      previousLabel="previous"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakLabel="..."
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      containerClassName="pagination"
                      activeClassName="active"
                      renderOnZeroPageCount={null}
                    />
                  </div>
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
