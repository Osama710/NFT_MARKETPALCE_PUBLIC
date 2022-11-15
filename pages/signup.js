import React from 'react';
import Layout from "../components/layout/Layout";
import {useMoralis} from 'react-moralis';
import {useRouter} from 'next/router';
import Signup from '../components/moralis/Signup';

function SignupPage({ }) {
    const router = useRouter();
    const {isAuthenticated} = useMoralis();

    React.useEffect(() => {
        if (router.query?.referral) {
            localStorage.setItem('referral', router.query.referral);
        }
    }, [router.query]);

    if (isAuthenticated) {
        router.replace('/profile');
    }

    return (
      <Layout
        headTitle="Mars1982 Coin (MARTEX)"
        pageTitleSub={"Mars1982 Coin (MARTEX)"}
        pageClass={"dashboard"}
        parent={"Home"}
        child={"Dashboard"}
      >
          <div className="row">
              <div className={'col-xxl-4 offset-xxl-4 col-lg-6 offset-lg-3'}>
                  <Signup />
              </div>
          </div>
      </Layout>
    );
}

export default SignupPage;
