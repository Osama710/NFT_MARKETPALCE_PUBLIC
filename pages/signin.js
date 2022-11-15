import Link from "next/link";
import SigninForm from "../components/form/SigninForm";

function Signin() {
    return (
        <>
            <div className="authincation section-padding">
                <div className="container h-100">
                    <div className="row justify-content-center h-100 align-items-center">
                        <div className="col-xl-5 col-md-6">
                            <div className="mini-logo text-center my-4">
                                <Link href="/">
                                        <img src="./images/martex@3x.png" alt="" />
                                </Link>
                                <h4 className="card-title mt-5">
                                    Sign in to NFT
                                </h4>
                            </div>
                            <div className="auth-form card">
                                <div className="card-body">
                                    <SigninForm />
                                    <p className="mt-3 mb-0">
                                        Don't have an account?
                                        <Link href="/signup">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="privacy-link">
                                <Link href="#">
                                        Have an issue with 2-factor
                                        authentication?
                                </Link>
                                <br />
                                <Link href="#">
                                   Privacy Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Signin;
