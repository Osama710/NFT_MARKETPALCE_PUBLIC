import Link from "next/link";
import { useRouter } from "next/router";
import {useMoralis} from 'react-moralis';

function Sidebar() {
    const router = useRouter();
    const { authenticate, isAuthenticated, user, logout } = useMoralis();
    return (
        <>
            <div className="sidebar">
                <div className="brand-logo">
                    <Link href="/">
                            <img src="./images/martex@3x.png" alt="" width="30" />
                    </Link>
                    {/* <Link href="/">
                        <a className="mini-logo">
                            <img src="./images/logoi.png" alt="" width="40" />
                        </a>
                    </Link> */}
                </div>
                <div className="menu">
                    <ul>
                        <li className={router.pathname == "/" ? "active" : ""}>
                            <Link  href="/">
                                    <span>
                                        <i className="ri-layout-grid-fill"></i>
                                    </span>
                                    <span className="nav-text">Dashboard</span>
                            </Link>
                        </li>
                        {/*<li className={router.pathname == "/bids" ? "active" : ""}>*/}
                        {/*    <Link href="/bids">*/}
                        {/*        <a>*/}
                        {/*            <span>*/}
                        {/*                <i className="ri-briefcase-line"></i>*/}
                        {/*            </span>*/}
                        {/*            <span className="nav-text">Bids</span>*/}
                        {/*        </a>*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        {/*<li className={router.pathname == "/saved" ? "active" : ""}>*/}
                        {/*    <Link href="/saved">*/}
                        {/*        <a>*/}
                        {/*            <span>*/}
                        {/*                <i className="ri-heart-line"></i>*/}
                        {/*            </span>*/}
                        {/*            <span className="nav-text">Saved</span>*/}
                        {/*        </a>*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        <li
                            className={
                                router.pathname == "/collection" ? "active" : ""
                            }
                        >
                            <Link href="/collection">
                                    <span>
                                        <i className="ri-star-line"></i>
                                    </span>
                                    <span className="nav-text">Collections</span>
                            </Link>
                        </li>
                        {/*<li*/}
                        {/*    className={*/}
                        {/*        router.pathname == "/wallet" ? "active" : ""*/}
                        {/*    }*/}
                        {/*>*/}
                        {/*    <Link href="/wallet">*/}
                        {/*        <a>*/}
                        {/*            <span>*/}
                        {/*                <i className="ri-wallet-line"></i>*/}
                        {/*            </span>*/}
                        {/*            <span className="nav-text">Wallet</span>*/}
                        {/*        </a>*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        {/*<li*/}
                        {/*    className={*/}
                        {/*        router.pathname == "/store" ? "active" : ""*/}
                        {/*    }*/}
                        {/*>*/}
                        {/*    <Link href="/store">*/}
                        {/*        <a>*/}
                        {/*            <span>*/}
                        {/*               <i class="ri-store-line"></i>*/}
                        {/*            </span>*/}
                        {/*            <span className="nav-text">Store</span>*/}
                        {/*        </a>*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        {/*<li*/}
                        {/*    className={*/}
                        {/*        router.pathname == "/games" ? "active" : ""*/}
                        {/*    }*/}
                        {/*>*/}
                        {/*    <Link href="/games">*/}
                        {/*        <a>*/}
                        {/*            <span>*/}
                        {/*               <i class="ri-gamepad-line"></i>*/}
                        {/*            </span>*/}
                        {/*            <span className="nav-text">games</span>*/}
                        {/*        </a>*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        <li
                            className={
                                router.pathname == "/profile" ? "active" : ""
                            }
                        >
                            <Link href={isAuthenticated ? "/profile" : '/signup'}>
                                    <span>
                                    <i className="ri-account-box-line"></i>
                                    </span>
                                    <span className="nav-text">Profile</span>
                            </Link>
                        </li>
                        {isAuthenticated && (<li
                            className={
                                router.pathname == "/settings-profile"
                                    ? "active"
                                    : ""
                            }
                        >
                            <Link href="/settings-profile">
                                    <span>
                                        <i className="ri-settings-3-line"></i>
                                    </span>
                                    <span className="nav-text">Settings</span>
                            </Link>
                        </li>)}
                        {isAuthenticated && (<li
                            className={'active logout'}
                        >
                            <a onClick={logout}>
                                <span>
                                    <i className="ri-logout-circle-line"></i>
                                </span>
                                <span className="nav-text">Signout</span>
                            </a>
                        </li>)}
                    </ul>
                </div>

                <div className="card-limit-progress">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="flex-grow-2 me-3">
                            <div className="d-flex justify-content-between mb-1">
                                <h5 className="mb-1">Visa</h5>
                                <p className="mb-0">
                                    <strong>75% </strong>
                                </p>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar bg-light"
                                    role="progressbar"
                                    style={{
                                        width: "75%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="flex-grow-2 me-3">
                            <div className="d-flex justify-content-between mb-1">
                                <h5 className="mb-1">Master</h5>
                                <p className="mb-0">
                                    <strong>65% </strong>
                                </p>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar bg-white"
                                    role="progressbar"
                                    style={{
                                        width: "65%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="flex-grow-2 me-3">
                            <div className="d-flex justify-content-between mb-1">
                                <h5 className="mb-1">Paypal</h5>
                                <p className="mb-0">
                                    <strong>50% </strong>
                                </p>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar bg-white"
                                    role="progressbar"
                                    style={{
                                        width: "50%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="flex-grow-2 me-3">
                            <div className="d-flex justify-content-between mb-1">
                                <h5 className="mb-1">Amex</h5>
                                <p className="mb-0">
                                    <strong>20% </strong>
                                </p>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar bg-white"
                                    role="progressbar"
                                    style={{
                                        width: "20%",
                                    }}
                                >

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Sidebar;
