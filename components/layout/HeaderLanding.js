import Link from "next/link";

function HeaderLanding() {
    return (
        <>
            <div className="header landing">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <nav className="navbar">
                                <div className="brand-logo">
                                    <Link href="/">
                                        <img src="./images/martex@3x.png" alt="" />
                                    </Link>
                                </div>
                                <div className="header-right">
                                    <a href="#" className="btn btn-primary">
                                        Buy
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default HeaderLanding;
