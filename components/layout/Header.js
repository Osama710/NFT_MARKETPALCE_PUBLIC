import Link from "next/link";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useMoralis } from "react-moralis";
import { useRouter } from 'next/router';
import { truncate } from '../../utils/converters';

function Header() {
    const { isAuthenticated, user, logout } = useMoralis();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/signup');
    }

    return (
        <>
            <div className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12 d-flex justify-content-between align-items-center">
                            <div className="brand-logo">
                                <Link href="/">
                                    <img src="./images/martex@3x.png" srcSet="./images/martex@3x.png 3x, ./images/martex@2x.png 2x, ./images/martex.png 1x" alt="" width="30" />
                                </Link>
                            </div>
                            <div></div>
                            <div className="header-content">
                                <div className="header-right">
                                    <button className={'d-flex align-items-center btn px-0'}>
                                        <span>&nbsp;Avalible Coin: <strong>0000</strong></span>
                                    </button>
                                    <Link href={'/collection'}>
                                        <button className={'d-flex align-items-center btn'}>
                                            <i className="ri-star-line"></i>
                                            <span>&nbsp;Collection</span>
                                        </button>
                                    </Link>

                                    {isAuthenticated ? (<UncontrolledDropdown
                                        tag="div"
                                        className="dropdown profile_log"
                                    >
                                        <DropdownToggle
                                            tag="div"
                                            data-toggle="dropdown"
                                        >
                                            <div className="user icon-menu active">
                                                <i className="ri-login-circle-line"></i>
                                                &nbsp; hello, {truncate(user?.get('username'), 8)}
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu
                                            right
                                            className="dropdown-menu"
                                        >
                                            <div className="user dropdown-item">
                                                <Link href={'/profile'}>
                                                    <div className="user-info">
                                                        <h5>{user?.get("username") || user?.get("ethAddress")}</h5>
                                                        <span>
                                                            {user?.getEmail()}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>

                                            <a className="dropdown-item logout" onClick={handleLogout}>
                                                <i className="ri-logout-circle-line"></i>
                                                Logout
                                            </a>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    ) : (
                                        <div>
                                            <Link href={'/signup'}>
                                                <button className={'d-flex align-items-center btn'}>
                                                    <i className="ri-login-circle-line"></i>
                                                    <span>&nbsp;LOGIN</span>
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Header;
