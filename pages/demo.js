import Link from "next/link";
import HeaderLanding from "../components/layout/HeaderLanding";
function Demo() {
    return (
        <>
            <HeaderLanding />
            <div className="intro section-padding" id="intro">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        
                        <div className="col-xl-6 col-md-6 py-md-5">
                            
                            <div className="intro-content my-5 text-center">
                                <h1>
                                    NFT - NFT Dashboard React App
                                </h1>
                                <p>
                                    NFT is the complete UX & UI dashboard for
                                    NFT. Here included bids, collection,
                                    wallet, and all user setting pages
                                    including profile, application, activity,
                                    payment method, api, sign in & sign up etc.
                                </p>
                            </div>
                            <div className="intro-demo_img">
                                <img
                                    src="/images/demo/dashboard.jpg"
                                    alt=""
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="demo section-padding">
                <div className="container">
                    <div className="row py-lg-5 justify-content-center">
                        <div className="col-xl-7">
                            <div className="section-title text-center">
                                <h2>Pages</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/dashboard.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Dashboard</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/bids">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/bids.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Bids</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/saved">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/saved.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Saved</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/collections">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/collections.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Collections</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/wallet">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/wallet.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Wallet</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/profile">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/profile.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>User Profile</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/settings-profile">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/settings-profile.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Profile Settings</h4>
                            </div>
                        </div>
                        
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/settings-application">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/settings-application.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Application</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/settings-security">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/settings-security.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Security</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/settings-activity">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/settings-activity.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Activity</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/settings-payment-method">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/settings-payment-method.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Payment Method</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/settings-api">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/settings-api.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Api</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/signin">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/signin.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Sign in Page</h4>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/signup">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/signup.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Sign up page</h4>
                            </div>
                        </div>

                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="/lock">
                                        <div className="img-wrap">
                                            <img
                                                src="/images/demo/locked.jpg"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                </Link>
                                <h4>Locked Page</h4>
                            </div>
                        </div>

                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="./otp1" target="_blank">
                                    <div className="img-wrap">
                                        <img src="./images/demo/otp-1.jpg" alt="" className="img-fluid" />
                                    </div>
                                </Link>
                                <h4>1 of 2-Step-Verification</h4>
                            </div>
                        </div>

                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="./otp2" target="_blank">
                                    <div className="img-wrap">
                                        <img src="./images/demo/otp-2.jpg" alt="" className="img-fluid" />
                                    </div>
                                </Link>
                                <h4>2 of 2-Step-Verification</h4>
                            </div>
                        </div>

                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="./verify-email" target="_blank">
                                    <div className="img-wrap">
                                        <img src="./images/demo/email-verification.jpg" alt="" className="img-fluid" />
                                    </div>
                                </Link>
                                <h4>Email Verification</h4>
                            </div>
                        </div>

                        <div className="col-xl-4 col-md-4 col-sm-6">
                            <div className="demo_img">
                                <Link href="./reset" target="_blank">
                                    <div className="img-wrap">
                                        <img src="./images/demo/reset.jpg" alt="" className="img-fluid" />
                                    </div>
                                </Link>
                                <h4>Reset Page</h4>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="features section-padding" data-scroll-index="2">
        <div className="container">
            <div className="row py-lg-5 justify-content-center">
                <div className="col-xl-7">
                    <div className="section-title text-center">
                        <span>Problem?</span>
                        <h2>Don't Worry, I am waiting your question</h2>
                        <p>Refreshing my inbox, waiting for your mail </p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="customer-support-content">
                        <span><i className="fab fa-whatsapp"></i></span>
                        <h4>+8801843666660</h4>
                        <p>Without sleeping time, I am avaiable in Whstsapp. I recommend Whstsapp</p>
                        <a href="https://api.whatsapp.com/send?phone=008801843666660">Send Message <i className="la la-angle-right"></i></a>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="customer-support-content">
                        <span><i className="fab fa-skype"></i></span>
                        <h4>sporsho9</h4>
                        <p>Without sleeping time, I am avaiable in skype. I also recommend Skype</p>
                        <a href="skype:profile_name?sporsho9">Add Skype <i className="la la-angle-right"></i></a>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="customer-support-content">
                        <span><i className="fas fa-envelope"></i></span>
                        <h4>imsaifun@gmail.com</h4>
                        <p>When you send me email, I get notification, and quickly reply you</p>
                        <a href="mailto:imsaifun@gmail.com">Send Email <i className="la la-angle-right"></i></a>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="customer-support-content">
                        <span><i className="fas fa-headset"></i></span>
                        <h4>Pre sale question</h4>
                        <p>You have need more design or customization? Dont worry about Quality</p>
                        <a href="https://docs.google.com/forms/d/1KjSr2pRP9GSydodBYOz05ke6faVX0MgFCAznaYdKl6E">Hire
                            Now <i className="la la-angle-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </>
    );
}
export default Demo;
