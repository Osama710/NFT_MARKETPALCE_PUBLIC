import React from 'react';
import {useMoralis} from 'react-moralis';
import {isSuperAdmin} from '../../utils/converters';
import Moralis from 'moralis';

const NFTCardAdmin = (props) => {
  const {item, collections, fetchNfts} = props;
  const [width, setWidth] = React.useState();
  const [price, setPrice] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const [sale, setSale] = React.useState(false);
  const [featured, setFeatured] = React.useState(false);
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [thumb, setThumb] = React.useState();
  const listRef = React.useRef();

  const {isAuthenticated, user} = useMoralis();
  const getListSize = () => {
    const newWidth = listRef?.current?.clientWidth;
    setWidth(newWidth);
  };

  const getCollection = () => {
    return collections.find(c => item.token_address === c.token_address);
  }

  const save = async () => {
    if (item?.id) {
      setLoading(true);
      const NFTDetails = Moralis.Object.extend("NFTDetails");
      const query = new Moralis.Query(NFTDetails);
      query.equalTo('objectId', item?.id);
      const editedNft = await query.first();
      if (editedNft) {
        editedNft.set('name', name);
        editedNft.set('price', price);
        editedNft.set('description', description);
        editedNft.set('sale', sale);
        editedNft.set('featured', featured);
        if (thumb) {
          editedNft.set('image_thumb_uri', thumb);
        }
        editedNft.save();
      }

      fetchNfts();
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getListSize();
    window.addEventListener("resize", getListSize);
    setSale(item?.sale);
    setFeatured(item?.featured);
    setPrice(item?.price || 0);
    setDescription(item?.description);
    setName(item?.name);
  }, [item]);

  const uploadThumb = async (e) => {
    const file = e.target.files[0];
    const img_2 = new Moralis.File(file.name, file);
    const image_thumb_ipfs = await img_2.saveIPFS();
    const image_thumb = `https://gateway.moralisipfs.com/ipfs/${image_thumb_ipfs.hash()}`;
    setThumb(image_thumb);
  }

  if (!isSuperAdmin(user)) {
    return null;
  }

  return (
    <div className="col">
      <div className="card items">
        <div className="card-body">
          <div className="items-img position-relative">
            <img
              src={item.image_thumb_uri}
              className="rounded mx-auto d-block rounded mb-3 img-wrap"
              alt=""
              width={'100%'}
              height={width}
              ref={listRef}
            />
            <img
              src={`/images/avatar/${item.avatar}`}
              className="creator"
              width="50"
              alt=""
            />
          </div>
          <p>
            <input
              className={'form-control'}
              type="file"
              onChange={uploadThumb}
            />
          </p>

          <p>
            <input
              className={'form-control'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </p>
          <p>
            <textarea
              className={'form-control'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </p>
          <p>
            <input
              type={'checkbox'}
              checked={sale}
              onChange={(e) => setSale(e.target.checked)}
            /> on sale
          </p>
          <p>
            <input
              type={'checkbox'}
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            /> featured
          </p>

          <div className="input-group mb-3">
            <input
              className={'form-control'}
              type={'number'}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">MARTEX</span>
              </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="text-start">
              <p className="mb-2">
                {getCollection()?.name}
              </p>
              <h5 className="text-muted">{item.amount}/{item.amount}</h5>
            </div>
          </div>


            {props?.children ? props.children : (
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-danger btn-lg align-items-center" onClick={() => save()} type={'button'}>
                  Save

                  {loading && (<div className="spinner-border text-light" role="status" />)}
                </button>
              </div>
            )}

        </div>
      </div>
    </div>
  );
}

export default NFTCardAdmin;
