import React from "react";
import Moralis from "moralis";
import * as referral from "../../utils/referrals";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { useDeviceSelectors } from "react-device-detect";

const imageMM = () => <img src={"/images/metamask-fox.svg"} height={32} />;
const imageWC = () => (
  <img src={"/images/walletconnect-circle-blue.png"} height={32} />
);

const Facebook = () => (
  <img src={"/images/facebook.png"} height={32} />
);

const Google = () => (
  <img src={"/images/google.png"} height={32} />
);

const Apple = () => (
  <img src={"/images/appstore.png"} height={32} />
);

const Signup = (props) => {
  const validation = async () => (await import("vanila-js-validation")).default;
  const [isMobileB, setIsMobileB] = React.useState(false);
  React.useEffect(() => {
    const [selectors, data] = useDeviceSelectors(window?.navigator?.userAgent);
    const { isMobile } = selectors;
    setIsMobileB(isMobile);
  }, []);

  const [register, setRegister] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState();
  const [email, setEmail] = React.useState("");
  const [emailConfirmation, setEmailConfirmation] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConf, setPasswordConf] = React.useState("");
  const [validUsername, setValidUsername] = React.useState(true);
  const [validEmail, setValidEmail] = React.useState(true);
  const [validEmailConfirmation, setValidEmailConfirmation] =
    React.useState(true);
  const [validPassword, setValidPassword] = React.useState(true);
  const [validPasswordConf, setValidPasswordConf] = React.useState(true);

  const { login, authenticate, enableWeb3, isWeb3Enabled, isAuthenticated } = useMoralis();
  const moralisCloudSendWallet = useMoralisCloudFunction('sendWalletViaEmail');

  React.useEffect(() => {
    if (!isWeb3Enabled && isAuthenticated) {
      enableWeb3({ provider: "walletconnect" });
      console.log("web3 activated");
    }
  }, [isWeb3Enabled, isAuthenticated]);

  const connectWallet = async (provider = "metamask") => {
    localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
    setIsLoading(true);
    try {
      await authenticate({ provider });
    } catch (e) {
      console.log(e.message);
    }
    setIsLoading(false);
  };

  const registerUser = async () => {
    const Validation = await validation();
    setError(undefined);
    setValidUsername(true);
    setValidEmail(true);
    setValidEmailConfirmation(true);
    setValidPassword(true);
    setValidPasswordConf(true);

    if (!username) {
      setValidUsername(false);
      return;
    }

    if (!email) {
      setValidEmail(false);
      return;
    }

    if (!emailConfirmation) {
      setValidEmailConfirmation(false);
      return;
    }

    if (!password) {
      setValidPassword(false);
      return;
    }

    if (!passwordConf) {
      setValidPasswordConf(false);
      return;
    }

    const isValidUsername = Validation.matchMinLength(username, 6);
    const isValidEmail = Validation.isValidEmail(email);
    const isValidEmailConfirmation =
      Validation.isValidEmail(emailConfirmation) &&
      Validation.isEqual(email, emailConfirmation);
    const isValidPassword = Validation.matchMinLength(password, 6);
    const isPasswordConfirmed = Validation.isEqual(password, passwordConf);

    if (
      isValidUsername &&
      isValidEmail &&
      isValidEmailConfirmation &&
      isValidPassword &&
      isPasswordConfirmed
    ) {
      setIsLoading(true);
      const u = new Moralis.User();
      u.set("username", username);
      u.set("password", password);
      u.set("email", email);

      try {
        await u.signUp();
        const ethers = Moralis.web3Library;

        const wallet = await ethers.Wallet.createRandom();
        const us = await login(username, password, { usePost: true });

        us.set("ethAddress", wallet.address);
        us.set("pass", wallet.privateKey);
        us.set("passphrase", wallet.mnemonic.phrase);
        await us.save();

        await moralisCloudSendWallet.fetch();

        const referralStored = localStorage.getItem("referral");
        const token = await referral.getToken();

        if (token) {
          try {
            await referral.setUserReferral(
              token,
              wallet.address,
              referralStored
            );
          } catch (e) {
            console.log("error", e);
          }
        }

        router.reload(window.location.pathname);
      } catch (error) {
        setError(error.message);
      }

      setIsLoading(false);
    }

    setValidUsername(isValidUsername);
    setValidEmail(isValidEmail);
    setValidEmailConfirmation(isValidEmailConfirmation);
    setValidPassword(isValidPassword);
    setValidPasswordConf(isPasswordConfirmed);
  };

  const loginUser = async () => {
    const Validation = await validation();
    setError(undefined);
    setValidUsername(true);
    setValidPassword(true);

    if (!username) {
      setValidUsername(false);
      return;
    }

    if (!password) {
      setValidPassword(false);
      return;
    }

    const isValidUsername = Validation.matchMinLength(username, 6);
    const isValidPassword = Validation.matchMinLength(password, 6);

    if (isValidUsername && isValidPassword) {
      setIsLoading(true);
      try {
        const l = await login(username, password, { usePost: true });
        console.log("cacca", l);

        if (!l) {
          setError("Username / password incorrect");
        }
      } catch (e) {
        setError("Username / password incorrect");
      }

      setIsLoading(false);
    }

    setValidUsername(isValidUsername);
    setValidPassword(isValidPassword);
  };

  let submit = (
    <>
      <div className={"row"}>
        <div className={"col d-grid"}>
          <button className={"btn btn-lg btn-success"} onClick={registerUser}>
            {isLoading && (
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Register
          </button>
        </div>
      </div>
      <div className={"row"}>
        <div className={"col d-grid"}>
          <button
            className={"btn btn-outline-primary"}
            onClick={() => setRegister(!register)}
          >
            {isLoading && (
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Already registered? Login instead
          </button>
        </div>
      </div>
    </>
  );

  if (!register) {
    submit = (
      <>
        <div className={"row"}>
          <div className={"col d-grid"}>
            <button className={"btn btn-lg btn-success"} onClick={loginUser}>
              {isLoading && (
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Login
            </button>
          </div>
        </div>
        <div className={"row"}>
          <div className={"col d-grid"}>
            <button
              className={"btn btn-outline-primary"}
              onClick={() => setRegister(!register)}
            >
              {isLoading && (
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              New user? Register first
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-body p-4">
          <h4>Login with your crypto wallet</h4>
          <div className={"d-grid gap-2 mt-4"}>
            {!isMobileB && (
              <button
                className={"btn btn-outline-primary btn-lg"}
                onClick={() => connectWallet()}
              >
                {isLoading && (
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Link Metamask {imageMM()}
              </button>
            )}
            <button
              className={"btn btn-outline-primary btn-lg"}
              onClick={() => connectWallet("walletconnect")}
            >
              {isLoading && (
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Link WalletConnect {imageWC()}
            </button>





          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-4 mb-5">
          <input
            name={"username"}
            type={"text"}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setValidUsername(true);
            }}
            className={"form-control form-control-lg"}
            placeholder={"username"}
          />
          {!validUsername && (
            <div className="form-text text-danger">
              Minimum length: 6 characters.
            </div>
          )}

          {register && (
            <input
              name={"email"}
              type={"email"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidEmail(true);
              }}
              className={"form-control form-control-lg mt-4"}
              placeholder={"email"}
            />
          )}
          {!validEmail && (
            <div className="form-text text-danger">
              Please provide a valid email.
            </div>
          )}

          {register && (
            <input
              name={"email_confirmation"}
              type={"email"}
              value={emailConfirmation}
              onChange={(e) => {
                setEmailConfirmation(e.target.value);
                setValidEmailConfirmation(true);
              }}
              className={"form-control form-control-lg mt-4"}
              placeholder={"Confirm email"}
            />
          )}
          {!validEmailConfirmation && (
            <div className="form-text text-danger">
              Please type again your email.
            </div>
          )}

          <input
            name={"password"}
            type={"password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidPassword(true);
            }}
            className={"form-control form-control-lg mt-4"}
            placeholder={"Password"}
          />
          {!validPassword && (
            <div className="form-text text-danger">
              Minimum length: 6 characters.
            </div>
          )}

          {register && (
            <input
              name={"password_confirmation"}
              type={"password"}
              value={passwordConf}
              onChange={(e) => {
                setPasswordConf(e.target.value);
                setValidPasswordConf(true);
              }}
              className={"form-control form-control-lg mt-4"}
              placeholder={"Confirm password"}
            />
          )}
          {!validPasswordConf && (
            <div className="form-text text-danger">Passwords do not match.</div>
          )}

          {register && (
            <>
              By registering you agree to our&nbsp;
              <a
                href={
                  "https://www.mars1982.com/INDEPENDENT%20PROMOTER%20AGREEMENT/"
                }
                target={"_blank"}
              >
                Independent promoter agreement
              </a>
              &nbsp;and&nbsp;
              <a
                href={
                  "https://www.mars1982.com/mars-1982-ltd-terms-of-service-and-privacy-policy/"
                }
                target={"_blank"}
              >
                Terms of service and Privacy policy
              </a>
            </>
          )}
          <p className="mb-0 mt-1" style={{cursor:'pointer'}}>Forget Password</p>
          <div className={"d-grid gap-2 mt-4 mb-2"}>
            {error && <div className="form-text text-danger">{error}</div>}
            {submit}
          </div>
          <div style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center',textAlign:'center' }}>
            <h6>OR<br></br>Login With</h6>
          </div>

          <div className={"d-grid gap-2 mt-2"}>
            <div style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                className={"btn btn-outline-primary btn-lg"}
                onClick={() => connectWallet("walletconnect")}
              >
                {isLoading && (
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                 {Facebook()}
              </button>
              <button style={{marginLeft:'10px'}}
                className={"btn btn-outline-primary btn-lg"}
                onClick={() => connectWallet("walletconnect")}
              >
                {isLoading && (
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                 {Apple()}
              </button>
              <button style={{marginLeft:'10px'}}
                className={"btn btn-outline-primary btn-lg"}
                onClick={() => connectWallet("walletconnect")}
              >
                {isLoading && (
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                 {Google()}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Signup;