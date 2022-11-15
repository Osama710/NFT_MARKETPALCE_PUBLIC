import Layout from "../components/layout/Layout";
import * as referral from '../utils/referrals';
import {useMoralis, useMoralisWeb3Api} from 'react-moralis';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Moralis from 'moralis';
import NFTCard from '../components/nfts/NFTCard';
import WalletComponent from '../components/moralis/WalletComponent';
import Transactions from '../components/moralis/Transactions';
import Referrals from '../components/moralis/Referrals';

function Profile() {
    const { isAuthenticated, user} = useMoralis();
    const [nfts, setNfts] = React.useState([]);
    const [userNfts, setUserNfts] = React.useState([]);
    const [collections, setCollections] = React.useState([]);
    const Web3Api = useMoralisWeb3Api();

    const router = useRouter();

    useEffect(() => {
        if (router.query?.referral) {
            referralSet(router.query.referral);
        }
    }, [router.query])

    const referralSet = async (parentAddress) => {
        if (isAuthenticated) {
            const token = await referral.getToken();
            if (token) {
                try {
                    const setter = await referral.setUserReferral(token, user.get('ethAddress'), parentAddress);
                } catch (e) {
                    console.log('error', e)
                }

            }
        }
    }

    const mapNFTs = () => {
        const NFTDetails = Moralis.Object.extend("NFTDetails");
        const query = new Moralis.Query(NFTDetails);

        return query;
    }

    const getCollections = async () => {
        const NFTCollections = Moralis.Object.extend("NFTCollections");
        const query = new Moralis.Query(NFTCollections);

        await query.find().then(response => {
            const mappedResponse = response.map(collection => {
                return {
                    name: collection.get('name'),
                    token_address: collection.get('token_address'),
                    sorting: collection.get('sorting'),
                }
            }).sort((a, b) => (a.sorting - b.sorting));

            setCollections(mappedResponse);
        });
    }

    const getUsersNFTs = async () => {
        const options = {
            chain: process.env.NEXT_PUBLIC_MORALIS_POLYGON,
        };
        const polygonNFTs = await Web3Api.account.getNFTs(options);
        setUserNfts(polygonNFTs.result);
        return polygonNFTs;
    };

    const initial = async () => {
        await getCollections();
        getUsersNFTs().then(async response => {
            const nfts = response.result;
            const query = mapNFTs();
            const results = await query.find();

            const mappedResults = results.map(r => ({
                ...r,
                token_id: r.get('token_id'),
                price: r.get('price'),
                image_thumb_uri: r.get('image_thumb_uri'),
                image_uri: r.get('image_uri'),
                name: r.get('name'),
                sale: r.get('sale'),
                description: r.get('description'),
            }));

            const mapped = nfts.map(nft => {
                const found = mappedResults.find(f => f.token_id === nft.token_id);

                return {
                    ...nft,
                    ...found,
                    available: nft?.amount || 0,
                };
            }).sort((a,b) => (b.token_id-a.token_id));

            setNfts(mapped);
        });
    }

    // ES2022: method to get NFTs from Moralis DB
    React.useEffect(() => {
        const waiter = setTimeout(() => initial(), 300);
        return () => clearTimeout(waiter);
    }, [user, isAuthenticated]);

    React.useEffect(() => {
        const waiter = setTimeout(() => initial(), 100);
        return () => clearTimeout(waiter);
    }, []);

    return (
        <>
            <Layout
                headTitle="Profile"
                pageTitle="Profile"
                pageTitleSub={"Welcome NFT Profile page"}
                pageClass={"dashboard"}
                parent={"Home"}
                child={"Profile"}
            >
                <div className="row">
                    <div className="col-lg-6">
                        <Referrals />
                    </div>
                    <div className="col-lg-6">
                        <WalletComponent />
                    </div>

                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Your NFTs</h4>
                            </div>
                            <div className="card-body bs-0 p-0 bg-transparent">
                                <div className="row">
                                    {nfts.map((nft, index) => (<NFTCard item={nft} collections={collections} key={index} owned/>))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <Transactions />
                    </div>

                </div>
            </Layout>
        </>
    );
}
export default Profile;
