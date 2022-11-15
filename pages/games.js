
import Layout from "../components/layout/Layout";
import * as referral from '../utils/referrals';
import {useMoralis} from 'react-moralis';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import $ from "jquery";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Col, Row, Tab, Nav, Container, Table, Form,InputGroup,FormControl,Accordion } from "react-bootstrap";

// import ReactFancyBox from 'react-fancybox';
// import 'react-fancybox/lib/fancybox.css';

function games() {

    const { isAuthenticated, user} = useMoralis();
    const [referralTokenUrl, setReferralTokenUrl] = useState();
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
                    console.log('setter', setter);
                    console.log('parentAddress', parentAddress);
                } catch (e) {
                    console.log('error', e)
                }

            }
        }
    }

    const referralGet = async () => {
        if (isAuthenticated) {
            const token = await referral.getToken();
            if (token) {
                try {
                    const parents = await referral.getUserReferrals(token, user.get('ethAddress'));
                    console.log('parents', parents);

                    const children = await referral.getUserReferralsDisplay(token, user.get('ethAddress'));
                    console.log('children', children);
                } catch (e) {
                    console.log('error', e)
                }

            }
        }
    }

    const referralGetTokenLink = async () => {
        if (isAuthenticated) {
            const token = await referral.getToken();
            if (token) {
                try {
                    const referralToken = await referral.getUserReferralToken(token, user.get('ethAddress'));
                    console.log('referralToken', referralToken);
                    setReferralTokenUrl(referralToken.data.address);
                } catch (e) {
                    console.log('error', e)
                }

            }
        }
    }

    return (
        <>
            <Layout
                headTitle="games"
                pageTitle="games"
                pageTitleSub={"Welcome NFT games page"}
                pageClass={"dashboard"}
                parent={"Home"}
                child={"games"}
            >
                <div className="row">
                    <div className="col-xxl-12 col-xl-12">
                        <div className="main-game-div">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="game-wid-main">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="game-img-div">
                                                <img
                                                src="/images/items/game1.jpg"
                                                    alt=""/>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="game-img-txt">
                                                    <h6>Town Crush</h6>
                                                    <div className="game-lst">
                                                    <ul>
                                                        <li>
                                                            <p>GENRE</p>
                                                            <b>Match-Three</b>
                                                        </li>
                                                        <li>
                                                            <p>DEVELOPMENT STATUS</p>
                                                            <b>Test Game</b>
                                                        </li>
                                                    </ul>
                                                    <ul>
                                                        <li>
                                                            <p>DEVELOPER</p>
                                                            <b>Gala Games</b>
                                                        </li>
                                                        <li>
                                                            <p>PLATFORM</p>
                                                            <b>Browser</b>
                                                        </li>
                                                    </ul>
                                                    </div>
                                                    <div className="game-visit-btn">
                                                    <Link href="/superior">
                                                             Visit Store
                                                    </Link>
                                                    <Link href="/game">
                                                             Play
                                                    </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="game-wid-main">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="game-img-div">
                                                <img
                                                src="/images/items/game2.png"
                                                    alt=""/>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="game-img-txt">
                                                    <h6>Spider Tanks</h6>
                                                    <div className="game-lst">
                                                    <ul>
                                                        <li>
                                                            <p>GENRE</p>
                                                            <b>Match-Three</b>
                                                        </li>
                                                        <li>
                                                            <p>DEVELOPMENT STATUS</p>
                                                            <b>Test Game</b>
                                                        </li>
                                                    </ul>
                                                    <ul>
                                                        <li>
                                                            <p>DEVELOPER</p>
                                                            <b>Gala Games</b>
                                                        </li>
                                                        <li>
                                                            <p>PLATFORM</p>
                                                            <b>Browser</b>
                                                        </li>
                                                    </ul>
                                                    </div>
                                                    <div className="game-visit-btn">
                                                    <Link href="/game">
                                                             Visit Store
                                                    </Link>
                                                    <Link href="/game">
                                                             Play
                                                    </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="game-wid-main">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="game-img-div">
                                                <img
                                                src="/images/items/game3.png"
                                                    alt=""/>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="game-img-txt">
                                                    <h6>Superior</h6>
                                                    <div className="game-lst">
                                                    <ul>
                                                        <li>
                                                            <p>GENRE</p>
                                                            <b>Match-Three</b>
                                                        </li>
                                                        <li>
                                                            <p>DEVELOPMENT STATUS</p>
                                                            <b>Test Game</b>
                                                        </li>
                                                    </ul>
                                                    <ul>
                                                        <li>
                                                            <p>DEVELOPER</p>
                                                            <b>Gala Games</b>
                                                        </li>
                                                        <li>
                                                            <p>PLATFORM</p>
                                                            <b>Browser</b>
                                                        </li>
                                                    </ul>
                                                    </div>
                                                    <div className="game-visit-btn">
                                                    <Link href="/game">
                                                             Visit Store
                                                    </Link>
                                                    <Link href="/game">
                                                             Play
                                                    </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="game-wid-main">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="game-img-div">
                                                <img
                                                src="/images/items/game4.png"
                                                    alt=""/>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="game-img-txt">
                                                    <h6>The Walking Dead: Empires</h6>
                                                    <div className="game-lst">
                                                    <ul>
                                                        <li>
                                                            <p>GENRE</p>
                                                            <b>Match-Three</b>
                                                        </li>
                                                        <li>
                                                            <p>DEVELOPMENT STATUS</p>
                                                            <b>Test Game</b>
                                                        </li>
                                                    </ul>
                                                    <ul>
                                                        <li>
                                                            <p>DEVELOPER</p>
                                                            <b>Gala Games</b>
                                                        </li>
                                                        <li>
                                                            <p>PLATFORM</p>
                                                            <b>Browser</b>
                                                        </li>
                                                    </ul>
                                                    </div>
                                                    <div className="game-visit-btn">
                                                    <Link href="/game">
                                                             Visit Store
                                                    </Link>
                                                    <Link href="/game">
                                                             Play
                                                    </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default games;
