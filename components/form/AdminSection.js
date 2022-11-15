import React from 'react';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Moralis from 'moralis';
import {useMoralis, useMoralisWeb3Api} from 'react-moralis';
import NFTCard from '../nfts/NFTCard';
import {isSuperAdmin} from '../../utils/converters';
import NFTCardAdmin from '../admin/NFTCardAdmin';

const initialValues = {
  name: "",
  image: null,
  image_thumb: null,
  collection: "",
  sale: true,
  featured: false,
  price: "100",
  quantity: 1,
  description: "",
};

const PreferencesSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    quantity: Yup.string().required("Quantity is required"),
    description: Yup.string().required("Description is required"),
  image: Yup.object().nullable(),
  image_thumb: Yup.object().nullable(),
  collection: Yup.string(),
});

const abi = [{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "bytes",
      "name": "data",
      "type": "bytes"
    }
  ],
  "name": "mint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];

function AdminSection() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();

  const [nfts, setNfts] = React.useState([]);
  const [collections, setCollections] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [progressState, setProgressState] = React.useState([]);
  const [errorsState, setErrorsState] = React.useState([]);
  const [nftEdit, setNftEdit] = React.useState();

  const Web3Api = useMoralisWeb3Api();

  const getCollections = async () => {
    setNfts([]);
    const NFTCollections = Moralis.Object.extend("NFTCollections");
    const query = new Moralis.Query(NFTCollections);

    await query.find().then(async response => {
      let newNfts = [];

      const mappedResponse = response.map(collection => {
        return {
          name: collection.get('name'),
          token_address: collection.get('token_address'),
          sorting: collection.get('sorting'),
        }
      }).sort((a, b) => (a.sorting - b.sorting));

      for (const collection of mappedResponse){
        const options = {
          address: collection.token_address,
          chain: process.env.NEXT_PUBLIC_MORALIS_POLYGON,
        };

        await Web3Api.token.getAllTokenIds(options).then(async response => {
          const nfts = response.result;
          const query = mapNFTs(nfts);
          const results = await query.find();

          const mappedResults = results.map(r => ({
            ...r,
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


          const mapped = nfts.map(nft => {
            const found = mappedResults.find(f => f?.token_id === nft?.token_id && f?.token_address?.toLowerCase() === nft?.token_address?.toLowerCase());

            return {
              ...nft,
              ...found
            };
          }).sort((a,b) => (b.token_id-a.token_id));

          newNfts = [...newNfts, ...mapped];
        });
      }

      setCollections(mappedResponse);
      setNfts(newNfts);
    });
  }


  const mapNFTs = (nfts) => {
    const NFTDetails = Moralis.Object.extend("NFTDetails");
    const query = new Moralis.Query(NFTDetails);
    // TODO: get more specific
    // console.log(nfts.map(n => n.token_id))
    // query.containsAll("token_id", nfts.map(n => n.token_id))

    return query;
  }

  const init = () => {
    if (isAuthenticated) {
      getCollections();
    }
  }

  React.useEffect(() => {
    init();
  }, [isAuthenticated]);

  if (!isSuperAdmin(user)) {
    return null;
  }

   const mintNft = async (fields) => {
     const errors = [];
     const progress = [];
     if (!isAuthenticated) {
       errors.push('Not authenticated, logout and login again!');
     } else {
       const ethers = Moralis.web3Library;

       const nameData = `{}`;

       const id = Math.floor(Date.now() * 0.001);

       const options = {
         contractAddress: fields.collection,
         functionName: 'mint',
         abi,
         params: {
           account: user.get('ethAddress'),
           id,
           amount: fields.quantity,
           data: ethers.utils.formatBytes32String(nameData),
         }
       }

       progress.push(`Started minting of token: ${id}`);
       setProgressState(progress);
       setLoading(true);
       const transaction = await Moralis.executeFunction(options);
       const result = await transaction.wait();

       if (result.status === 1) {
         progress.push(`Minting of token ${id} Completed!`);
         setProgressState(progress);
         let image = '';
         let image_thumb = '';
         try {
           progress.push(`Started IPFS of full image`);
           setProgressState(progress);
           const img_1 = new Moralis.File(fields.image.name, fields.image);
           const image_ipfs = await img_1.saveIPFS();
           image = `https://gateway.moralisipfs.com/ipfs/${image_ipfs.hash()}`;
           progress.push(`Completed IPFS at ${image}`);
           setProgressState(progress);
         } catch {
           errors.push('Failed to store the main image');
         }

         try {
           progress.push(`Started IPFS of thumb image`);
           setProgressState(progress);
           const img_2 = new Moralis.File(fields.image_thumb.name, fields.image_thumb);
           const image_thumb_ipfs = await img_2.saveIPFS();
           image_thumb = `https://gateway.moralisipfs.com/ipfs/${image_thumb_ipfs.hash()}`;
           progress.push(`Completed IPFS at ${image_thumb}`);
           setProgressState(progress);
         } catch {
           errors.push('Failed to store the thumb image');
         }

         progress.push(`Started DB storage for Metadata`);
         setProgressState(progress);
         const NFTDetails = Moralis.Object.extend("NFTDetails");
         const newNft = new NFTDetails();
         newNft.set("name", fields.name);
         newNft.set("description", fields.description);
         newNft.set("sale", fields.sale);
         newNft.set("featured", fields.featured);
         newNft.set("price", fields.price.toString());
         newNft.set("image_uri", image);
         newNft.set("image_thumb_uri", image_thumb);
         newNft.set("token_id", id.toString());
         newNft.set("token_address", fields.collection);
         newNft.set("quantity", fields.quantity);
         newNft.save().then((response) => {
           progress.push(`DB storage for Metadata: Completed!`);
           setProgressState(progress);
           progress.push(`TOTAL MINTING PROCESS: Completed!`);
           setProgressState(progress);
           setSuccess(true);
           init();
         }, () => {
           errors.push('Failed to add details '  + transaction.hash);
         });
       } else {
         errors.push('Failed to Mint!');
       }
     }

     setErrorsState(errors);
     setLoading(false);
   }

   const makeJson = async (myData) => {
     const fileName = "metadata";
     const json = JSON.stringify(myData);
     const blob = new Blob([json],{type:'application/json'});
     const href = await URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = href;
     link.download = fileName + ".json";
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
   }

   const edit = (nft) => {
     setNftEdit(nft);
   }

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={PreferencesSchema}
                onSubmit={(fields) => {
                  mintNft(fields);
                }}
            >
                {({ errors, status, touched, setFieldValue }) => (
                    <>
                      <Form>
                        <div className="row">
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                              <h3>Mint NFT</h3>
                              <div className={'mb-3'}>
                                <label className="form-label">
                                  Name
                                </label>
                                <Field
                                  name={'name'}
                                  type={'text'}
                                  className={
                                    "form-control" +
                                    (errors.name && touched.name ? " is-invalid" : "")
                                  }
                                />
                                <ErrorMessage
                                  name="name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className={'mb-3'}>
                                <label className="form-label">
                                  Image FULL
                                </label><br />
                                <input
                                  name={'image'}
                                  type={'file'}
                                  onChange={(event) => {
                                    setFieldValue("image", event.currentTarget.files[0]);
                                  }}
                                />
                              </div>
                              <div className={'mb-3'}>
                                <label className="form-label">
                                  Image THUMB
                                </label><br />
                                <input
                                  name={'image_thumb'}
                                  type={'file'}
                                  onChange={(event) => {
                                    setFieldValue("image_thumb", event.currentTarget.files[0]);
                                  }}
                                />
                              </div>
                              <div className={'mb-3'}>
                                <label className="form-label">
                                  Collection
                                </label>
                                <Field
                                  name="collection"
                                  as="select"
                                  className={'form-control'}
                                  onChange={(event) => {
                                    setFieldValue("collection", event.currentTarget.value);
                                  }}
                                >
                                  <option value="" key="0">-- Select a category --</option>

                                  {collections.map(coll => (
                                    <option value={coll.token_address} key={coll.token_address}>{coll.name}</option>
                                  ))}
                                </Field>
                              </div>
                              <div className={'mb-3'}>
                                <label className="form-label">
                                  Quantity
                                </label>
                                <Field
                                  name={'quantity'}
                                  type={'number'}
                                  className={
                                    "form-control" +
                                    (errors.quantity && touched.quantity ? " is-invalid" : "")
                                  }
                                />
                                <ErrorMessage
                                  name="quantity"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="input-group mb-3">
                                <Field
                                  name={'price'}
                                  type={'number'}
                                  className={"form-control"}
                                />
                                <div className="input-group-append">
                                  <span className="input-group-text">MARTEX</span>
                                </div>
                              </div>
                              <div className={'mb-3'}>
                                <Field
                                  name={'sale'}
                                  type={'checkbox'}
                                />
                                <label className="form-label" htmlFor={'sale'}>
                                  &nbsp;Put on sale
                                </label>
                              </div>
                              <div className={'mb-3'}>
                                <Field
                                  name={'featured'}
                                  type={'checkbox'}
                                />
                                <label className="form-label" htmlFor={'featured'}>
                                  &nbsp;Featured
                                </label>
                              </div>
                              <div className={'mb-3'}>
                                <label className="form-label">
                                  Description
                                </label>
                                <Field
                                  name={'description'}
                                  as={'textarea'}
                                  className={
                                    "form-control" +
                                    (errors.description && touched.description ? " is-invalid" : "")
                                  }
                                />
                                <ErrorMessage
                                  name="description"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="mt-3 align-items-center d-flex flex-row">
                                <div className={"pr-3"}>
                                  <button
                                    type="submit"
                                    className={"btn btn-lg align-items-center d-flex" + success ? ' btn-info' : ' btn-primary'}
                                  >
                                    Save {success && (
                                      <i className="ri-check-line" />
                                  )}
                                    {loading && (<div className="spinner-border text-light" role="status" />)}
                                  </button>

                                  &nbsp;

                                  <button
                                    type="reset"
                                    className={"btn btn-lg btn-outline-danger"}
                                    onClick={() => {
                                      setLoading(false);
                                      setSuccess(false);
                                      setNftEdit();
                                    }}
                                  >Reset</button>
                                </div>


                              </div>
                              <div>
                                {progressState.map((p, index) => (
                                  <div className={'text-primary mt-2'} key={index}>{p}</div>
                                ))}
                              </div>
                              <div>
                                {errorsState.map((error, index) => (
                                  <div className={'text-danger mt-2'} key={index}>{error}</div>
                                ))}
                              </div>
                            </div>

                          {nftEdit && (<div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                            <button className={'btn btn-lg btn-outline-danger mb-3'} onClick={() => setNftEdit()}>
                              Cancel editing
                            </button>
                            <NFTCardAdmin item={nftEdit} collections={collections} fetchNfts={init}/>
                          </div>)}
                        </div>
                      </Form>

                      <div className={'row'}>
                        <div className="col vh-100">
                          <div className={'overflow-auto vh-100 row'}>
                            {nfts.map((nft, index) => {
                              return (
                                <NFTCard item={nft} collections={collections} key={index}>
                                  <div className="d-block">
                                    <button
                                      className={'btn btn-sm btn-success'}
                                      onClick={() => makeJson(nft)}
                                    >JSON</button>
                                    <button className={'btn btn-sm btn-danger'} onClick={() => edit(nft)}>Edit</button>
                                  </div>
                                </NFTCard>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                  </>
                )}
            </Formik>
        </>
    );
}
export default AdminSection;
