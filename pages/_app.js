import React from 'react';
import { Provider } from 'react-redux';
import { MoralisProvider } from "react-moralis";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/css/style.css';
import store from '../redux/store';
import 'react-perfect-scrollbar/dist/css/styles.css';

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    document.body.classList.add('dark-theme');
  }, []);

    return (
        <>
            <Provider store={store}>
                <MoralisProvider
                  serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
                  appId={process.env.NEXT_PUBLIC_MORALIS_APP_KEY}
                >
                    <Component {...pageProps} />
                </MoralisProvider>
            </Provider>
        </>
    )
  }

export default MyApp;


