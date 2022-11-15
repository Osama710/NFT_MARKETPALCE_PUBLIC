import React from 'react';
import {useMoralis} from 'react-moralis';
import * as referral from '../../utils/referrals';
import Address from './Address';
import {displayAddress} from '../../utils/converters';
import {getShortenedUrl} from '../../utils/referrals';

const Referrals = (props) => {
  const {isAuthenticated, user} = useMoralis();

  const [referrals, setReferrals] = React.useState([]);
  const [display, setDisplay] = React.useState([]);
  const [refToken, setRefToken] = React.useState();

  const init = () => {
    const userAddress = user?.get('ethAddress');

    if (isAuthenticated && userAddress) {
      const refe = async () => {
        const token = await referral.getToken();
        if (token) {
          referral.getUserReferrals(token, userAddress).then((res) => {
            setReferrals(res.data);
          });
          referral.getUserReferralsDisplay(token, userAddress).then((res) => {
            setDisplay(res.data);
          });
          referral.getUserReferralToken(token, userAddress).then(async (res) => {
            const shortened = localStorage.getItem("refToken");
            if (!shortened) {
              const url = `${process.env.NEXT_PUBLIC_APP_URL}/?referral=${res.data.address}`;
              let shortened = await getShortenedUrl(url);
              localStorage.setItem("refToken", shortened);
            }

            setRefToken(shortened);
          });
        }
      }

      return refe();
    }
  }

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    init();
  }, [user]);


  return (
    <div className={'row'}>
      <div className={'col'}>
        <div className="card">
          <div className="card-body p-4">
            <h4>Your referrals:</h4>
            <table className="table">
              <thead>
              <tr>
                <th scope="col">Level</th>
                <th scope="col">Commission</th>
                <th scope="col">Quantity</th>
              </tr>
              </thead>
              <tbody>
              {Object.keys(display).map((key, index) => (
                <tr key={index}>
                  <td className="me-auto">
                    <div className="fw-bold text-capitalize">{key}</div>
                  </td>
                  <td className="text-end justify-content-end">
                    {`${referral.commissions[key] * 100}%`}
                  </td>
                  <td className="text-end justify-content-end">
                    {display[key]}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
      <div className={'col'}>
        <div className="card mb-0">
          <div className="card-body p-4 mb-3">
            {referrals?.first && (
              <>
                <h4>Your referrer:</h4>
                <p>{displayAddress(referrals.first)}</p>
              </>
            )}
            <h4>Your referral link</h4>
            <Address address={refToken} long />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
