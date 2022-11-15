import Link from "next/link";
import { useRouter } from "next/router";
import {useMoralis} from 'react-moralis';
import {isSuperAdmin} from '../../utils/converters';

function SettingsMenu() {
    const router = useRouter();
    const {isAuthenticated, user} = useMoralis();

    return (
        <>
         

            <ul className="settings-menu">
                {isSuperAdmin(user) && (<li
                  className={
                      router.pathname == "/settings-application"
                        ? "active"
                        : ""
                  }
                >
                    <Link href="/settings-application">
                        Super Admin Application
                    </Link>
                </li>)}

                <li
                    className={
                        router.pathname == "/settings-profile" ? "active" : ""
                    }
                >
                    <Link href="/settings-profile">
                        Profile
                    </Link>
                </li>

                {/*<li*/}
                {/*    className={*/}
                {/*        router.pathname == "/settings-security" ? "active" : ""*/}
                {/*    }*/}
                {/*>*/}
                {/*    <Link href="/settings-security">*/}
                {/*        <a>Security</a>*/}
                {/*    </Link>*/}
                {/*</li>*/}
                {/*<li*/}
                {/*    className={*/}
                {/*        router.pathname == "/settings-activity" ? "active" : ""*/}
                {/*    }*/}
                {/*>*/}
                {/*    <Link href="/settings-activity">*/}
                {/*        <a>Activity</a>*/}
                {/*    </Link>*/}
                {/*</li>*/}
                {/*<li*/}
                {/*    className={*/}
                {/*        router.pathname == "/settings-payment-method"*/}
                {/*            ? "active"*/}
                {/*            : ""*/}
                {/*    }*/}
                {/*>*/}
                {/*    <Link href="/settings-payment-method">*/}
                {/*        <a>Payment Method</a>*/}
                {/*    </Link>*/}
                {/*</li>*/}
                {/*<li*/}
                {/*    className={*/}
                {/*        router.pathname == "/settings-api" ? "active" : ""*/}
                {/*    }*/}
                {/*>*/}
                {/*    <Link href="/settings-api">*/}
                {/*        <a>API</a>*/}
                {/*    </Link>*/}
                {/*</li>*/}
            </ul>
        </>
    );
}
export default SettingsMenu;
