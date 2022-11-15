import React from 'react';
import Layout from "../components/layout/Layout";
import PersonalInfo from "./../components/form/PersonalInfo";
import UpdateAvatar from "./../components/form/UpdateAvatar";
import SettingsMenu from "./../components/layout/SettingsMenu";
import {useMoralis} from 'react-moralis';
import Moralis from 'moralis';

function SettingsProfile() {
    const { authenticate, isAuthenticated, user, logout } = useMoralis();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');

    React.useEffect(() => {
        if (isAuthenticated) {
            setUsername(user?.getUsername() || '');
            setEmail(user?.getEmail() || '');
        }
    }, [isAuthenticated]);

    const connectAccount = () => {
        const userNew = Moralis.User.current();
        if (username && username != user?.getUsername()) {
            userNew.set("username", username);
        }

        if (email && email != user?.getEmail()) {
            userNew.set("email", email);
        }

        if (password) {
            userNew.set("password", password);
        }

        userNew.save();
    }

    return (
        <>
            <Layout
                headTitle="Profile"
                pageTitle="Profile"
                pageTitleSub={"Welcome NFT Settings Profile page"}
                pageClass={"dashboard"}
                parent={"Settings"}
                child={"Profile"}
            >
                <SettingsMenu />
                <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">User Profile</h4>
                            </div>

                                {isAuthenticated && (
                                  <div className="card-body">
                                    <label className="form-label">Wallet address</label>
                                      {user?.get("ethAddress") ? (<blockquote>{user?.get("ethAddress")}</blockquote>) :
                                        (<input
                                        name="fullName"
                                        type="text"
                                        className={"form-control"}
                                        value={user?.get("ethAddress")}
                                        disabled={true}
                                    />)}

                                  </div>
                                )}
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Connected Profile</h4>
                            </div>
                            {isAuthenticated && (<div className="card-body">
                                <label className="form-label">Email</label>
                                <input
                                  name="email"
                                  type="email"
                                  className={"form-control"}
                                  value={email}
                                  onChange={e => setEmail(e.target.value)}
                                />
                                <label className="form-label">username</label>
                                <input
                                  name="username"
                                  type="text"
                                  className={"form-control"}
                                  value={username}
                                  onChange={e => setUsername(e.target.value)}
                                />
                                <label className="form-label">Password</label>
                                <input
                                  name="password"
                                  type="password"
                                  className={"form-control"}
                                  onChange={e => setPassword(e.target.value)}
                                  value={password}
                                />

                                <button
                                  className={'btn btn-success'}
                                  onClick={connectAccount}
                                >
                                    Connect
                                </button>
                            </div>)}

                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default SettingsProfile;
