import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import { AppProps } from 'next/app';
import config from '../common/config.json';
import SmTags from '../components/sm-tags/tags';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content={config.description} />
        <meta name="keywords" content={config.keywords} />
        <SmTags {...config} />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
