import React from "react";
import { initPurchase, initPurchaseStripe } from "../../utils/moralis";
import Link from "next/link";
import { moneyFormatMartexToDollar, truncate } from "../../utils/converters";
import { useMoralis } from "react-moralis";
import { useDeviceSelectors } from "react-device-detect";
import ModalPopup from "../elements/ModalPopup";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from "next-share";
import { useRouter } from "next/router";

const NFTCard = (props) => {
  const router = useRouter();
  const [urlHost, setUrlHost] = React.useState("");
  React.useEffect(() => {
    const host = window.location.host;
    const baseUrl = `https://${host}`;

    setUrlHost(`${baseUrl}`);
  }, [router]);
  const Facebook = () => <img src={"/images/facebook.png"} height={32} />;
  const [isshare, setisshare] = React.useState(false);
  const Refresh = () => (
    <img
      style={{
        filter:
          "brightness(0) saturate(100%) invert(35%) sepia(82%) saturate(4075%) hue-rotate(240deg) brightness(96%) contrast(97%)",
      }}
      src={"/images/refresh.png"}
      height={20}
    />
  );

  const Instagram = () => <img src={"/images/Instagram.png"} height={32} />;
  const Discord = () => <img src={"/images/Discord.png"} height={32} />;
  const Whatsapp = () => <img src={"/images/Whatsapp.png"} height={32} />;
  const { item, collections, initial } = props;
  const [width, setWidth] = React.useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [internalLoading, setInternalLoading] = React.useState(false);
  const listRef = React.useRef();
  const { isAuthenticated, isWeb3Enabled, enableWeb3 } = useMoralis();
  let isMobile = false;
  if (typeof window !== "undefined") {
    const nav = window?.navigator?.userAgent;
    const [selectors, data] = useDeviceSelectors(nav);
    isMobile = selectors.isMobile;
  }

  React.useEffect(() => {
    if (!isWeb3Enabled && isAuthenticated) {
      enableWeb3({ provider: isMobile ? "walletconnect" : "metamask" });
    }
  }, [isWeb3Enabled, isAuthenticated]);

  const getListSize = () => {
    const newWidth = listRef?.current?.clientWidth;
    setWidth(newWidth);
  };

  React.useEffect(() => {
    getListSize();
    window.addEventListener("resize", getListSize);
  }, []);

  const getCollection = () => {
    return collections.find((c) => item.token_address === c.token_address);
  };

  const buyNow = async (stripe = false) => {
    setInternalLoading(true);
    try {
      if (stripe) {
        await initPurchaseStripe(item);
      } else {
        await initPurchase(item);
      }
    } catch (e) {
      // whatever
    }
    setInternalLoading(false);
  };

  const buyButtons = () => {
    if (props?.owned) {
      return null;
    }

    if (!isAuthenticated) {
      return (
        // <Link href={"/signup"}>
        <>
          <button
            className="btn btn-success btn-lg d-flex align-items-center justify-content-center"
            onClick={() => setModalShow(true)}
          >
            Login to buy
          </button>
          <ModalPopup show={modalShow} onHide={() => setModalShow(false)} />
        </>
        // </Link>
      );
    }
    return (
      <div>
        <button
          className="btn btn-success btn-lg d-flex align-items-center justify-content-center"
          onClick={() => buyNow(false)}
          disabled={!item?.sale || item.available < 1}
        >
          Buy now with MARTEX&nbsp;
          {internalLoading && (
            <div className="spinner-border text-light" role="status" />
          )}
        </button>
        <button
          className="btn btn-primary btn-lg d-flex align-items-center justify-content-center mt-2"
          onClick={() => buyNow(true)}
          disabled={!item?.sale || item.available < 1}
        >
          Buy now with USD&nbsp;
          {internalLoading && (
            <div className="spinner-border text-light" role="status" />
          )}
        </button>
      </div>
    );
  };

  if (!item) {
    return null;
  }

  return (
    <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-6">
      <div className="card items">
        <div className="card-body">
          <div className="items-img position-relative">
            <img
              src={item.image_thumb_uri}
              className="rounded mx-auto d-block rounded mb-3 img-wrap"
              alt=""
              width={"100%"}
              height={width}
              ref={listRef}
            />
            <img
              src={`/images/martex@3x.png`}
              className="creator"
              width="36"
              alt=""
            />
          </div>

          <h4 className="card-title">{item.name}</h4>
          <p>{truncate(item.description)}</p>

          <div className="d-flex justify-content-between">
            <div className="text-start">
              <p className="mb-2">{getCollection()?.name}</p>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="text-start d-flex align-items-start gap-2">
              {props?.owned ? (
                <h5 className="text-muted">{item.available}</h5>
              ) : (
                <h5 className="text-muted">
                  {item.available || 0}/{item.amount}
                </h5>
              )}
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "0",
                }}
                onClick={() => initial()}
              >
                {Refresh()}
              </button>
            </div>
            <div className="text-end">
              <h5 className="text-success">{item.price} MARTEX</h5>
              <h5 className="text-primary">
                {moneyFormatMartexToDollar(item.price)} USD
              </h5>
            </div>
          </div>

          {props?.children ? (
            props.children
          ) : (
            <div className="d-flex justify-content-center mt-3 flex-column">
              {buyButtons()}
              <Link href={`/detail/${item.id}`}>
                <button className="btn btn-outline-primary">Details</button>
              </Link>
            </div>
          )}

          <div className="d-flex justify-content-center flex-column">
            <button
              onClick={() => setisshare(isshare !== true ? true : false)}
              className="btn btn-outline-primary"
            >
              Share
            </button>
          </div>

          {isshare !== false ? (
            <div className="share_icons">
              <div className="row">
                <div className="col-3 p-2" style={{ cursor: "pointer" }}>
                  {/* {Facebook()} */}
                  <FacebookShareButton
                    url={urlHost + `/detail/${item.id}`}
                    quote={item.name}
                    hashtag={"#nft #marsNft #blockchain"}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                </div>
                <div className="col-3 p-2" style={{ cursor: "pointer" }}>
                  {/* {Instagram()} */}
                  <TwitterShareButton
                    url={urlHost + `/detail/${item.id}`}
                    title={item.name}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </div>
                <div className="col-3 p-2" style={{ cursor: "pointer" }}>
                  {/* {Whatsapp()} */}
                  <WhatsappShareButton
                    url={urlHost + `/detail/${item.id}`}
                    title={item.name}
                    separator=":: "
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
                <div className="col-3 p-2" style={{ cursor: "pointer" }}>
                  {/* {Discord()} */}
                  <LinkedinShareButton url={urlHost + `/detail/${item.id}`}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
