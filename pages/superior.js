
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
import Gallery_slider from '../components/Gallery/gallery_slider';
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
                    <div className="game-logo">
                            <img src="/images/items/logo-superior.png" alt="" />
                        </div>
                    <div className="slider-card">
                        
          <Row>
            <Col md={8}>
              <Gallery_slider />
            </Col>
            <Col md={4}>
              <div className="slide-info-box">
                <Table>
                  <tbody>
                    <tr>
                      <td>DEVELOPER</td>
                      <td>Ember Entertainment</td>
                    </tr>
                    <tr>
                      <td>PLATFORM</td>
                      <td>PC</td>
                    </tr>
                    <tr>
                      <td>GENRE</td>
                      <td>Survival MMORPG</td>
                    </tr>
                    <tr>
                      <td>STATUS</td>
                      <td>In Development</td>
                    </tr>
                  </tbody>
                </Table>
                <div className="sp"></div>
                <div className="sp-para">
                  <p>The Walking Dead:Empires is a multiplayer survival game set in the treacherous world of AMC's The Walking Dead. Survive in this harsh reality by doing whatever it takes. Scavenge for supplies and construct your new home. Team up with allies, compete against maniacal foes, and always beware the dead.</p>
                </div>
              </div>
              <div className="socio-links">
                <a href="https://superior.game/">Visit Website</a>
                <a href="https://discord.com/invite/JtnCNMFnnK">Join Discord</a>
              </div>
            </Col>
          </Row>
        </div>
                       {/* filter bar  */}
                       <div className="filter-bar">
          <Row>
            <Col md={6}>
              <div className="custom-select-box">
                <div className="custom-select">
                <Form.Select aria-label="Default select example">
                <option>All Currencies</option>
                    <option value="1">ALL</option>
                    <option value="2">BAT</option>
                    <option value="3">MTRM</option>
                    <option value="">GALA</option>
                    <option value="">TOWN</option>
                    <option value="">TEST[GC]</option>
                    <option value="">ETH</option>
                </Form.Select>
                </div>
                <div className="custom-select">
                <Form.Select aria-label="Default select example">
                <option value="1">Popularity</option>
                    <option value="2">Price: Low to High</option>
                    <option value="3">Price: High to Low</option>
                    <option selected>Newest Arrivals</option>
                </Form.Select>
                </div>
                
              </div>
              
            </Col>
            <Col md={6}>
              <div className="search-box">
              <InputGroup>
    <InputGroup.Text id="inputGroup-sizing-default"><i class="ri-search-line"></i></InputGroup.Text>
    <FormControl
      aria-label="Default"
      aria-describedby="inputGroup-sizing-default"
      placeholder='Search'
    />
  </InputGroup>
              </div>
            </Col>
          </Row>
        </div>
        {/* filter bar END */}

        {/* main section  */}
        <div className="main-section">
          <Row>
            <Col md={3}>
              <div className="main-filter">
              <Accordion>
              <Accordion.Item eventKey="6">
    <Accordion.Header>Games</Accordion.Header>
    <Accordion.Body className="game-accord">
     <ul>
       <li>
        <img src="images/items/g1.png" alt="icon" /> Fortitude
        </li>
        <li>
    
        <img src="images/items/g2.png" alt="icon" /> Gala Music
        </li>
        <li>
    
        <img src="images/items/g3.png" alt="icon" /> Legacy
        </li>
        <li>
    
        <img src="images/items/g4.png" alt="icon" /> Mirandus
        </li>
     </ul>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="0">
    <Accordion.Header>Rarity</Accordion.Header>
    <Accordion.Body>
     <ul>
       <li>
    <Form.Check type="checkbox"/>
        <img src="images/items/ic-1.png" alt="icon" /> Common
        </li>
        <li>
    <Form.Check type="checkbox"/>
        <img src="images/items/ic-2.png" alt="icon" /> UnCommon
        </li>
        <li>
    <Form.Check type="checkbox"/>
        <img src="images/items/ic-3.png" alt="icon" /> Rare
        </li>
        <li>
    <Form.Check type="checkbox"/>
        <img src="images/items/ic-4.png" alt="icon" /> Epic
        </li>
        <li>
    <Form.Check type="checkbox"/>
        <img src="images/items/ic-5.png" alt="icon" /> Legendary
        </li>
        <li>
    <Form.Check type="checkbox"/>
        <img src="images/items/ic-6.png" alt="icon" /> Ancient
        </li>
     </ul>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>Availability</Accordion.Header>
    <Accordion.Body>
    <ul className='ava'>
    <li>
    <Form.Check type="checkbox"/>
         Sold Out
        </li>
        <li>
    <Form.Check type="checkbox"/>
          Available
        </li>
    </ul>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Header>Type</Accordion.Header>
    <Accordion.Body>
    <ul className='ava'>
    <li>
    <Form.Check type="checkbox"/>
        Crafting
        </li>
    </ul>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
              </div>
            </Col>
            <Col md={9}>
              <Row>
                <Col md={4}>
                <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img1.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                        <div className="sold-out-game">
                            <h4>sold out!</h4>
                            <span>we are sorry</span>
                        </div>
                    </div>
                    <div className="card-txt">
                      <h6>Georgia Forge (Epic)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>41,861</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                  </Link>
                </Col>
                <Col md={4}>
                    <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img2.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                    </div>
                    <div className="card-txt">
                      <h6>Georgia Lab (Epic)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>27,907</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                   </Link>
                </Col>
                <Col md={4}>
                    <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img3.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                    </div>
                    <div className="card-txt">
                      <h6>Georgia Lab (Legendary)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>84,303</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                   </Link>
                </Col>
                <Col md={4}>
                    <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img4.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                    </div>
                    <div className="card-txt">
                      <h6>Georgia Forge (Legendary)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>126,455</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                   </Link>
                </Col>
                <Col md={4}>
                    <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img5.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                    </div>
                    <div className="card-txt">
                      <h6>Georgia Lab (Rare)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>11,163</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                  </Link>
                </Col>
                <Col md={4}>
                    <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img6.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                    </div>
                    <div className="card-txt">
                      <h6> Georgia Forge (Ancient)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>375,004</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                   </Link>
                </Col>
                <Col md={4}>
                    <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img7.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                      <div className="sold-out">
                        <div className="sold-txt">
                        <h3>SOLD <br /> OUT!</h3>
                        <p>We're SORRY</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-txt">
                      <h6>Georgia Forge (Rare)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>16,744</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                   </Link>
                </Col>
                <Col md={4}>
                    <Link href="/detail">
                  <div className="main-card similar-item-wid">
                    <div className="card-img sim-item-img">
                      <img src="images/items/card-img8.gif" alt="gif" />
                      <div className="sim-item-img-txt">
                                            <span>35/2,500 left</span>
                                            <img src="/images/items/token.png" alt=""/>
                                        </div>
                    </div>
                    <div className="card-txt">
                      <h6> Georgia Lab (Uncommon)</h6>
                     <div className="coin-im"> <img src="/images/items/coin.png" alt="coin" /> <span>3,488</span></div>
                     <p>The Walking Dead: Empires</p>
                    </div>
                  </div>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        {/* main section END */}
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default games;
