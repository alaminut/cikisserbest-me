import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="tr">
        <Head>
          {/*<meta name="theme-color" content={theme.palette.primary.main} />*/}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-K5M41TM6FY" />
          <script dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-K5M41TM6FY');
            `,
          }}>
          </script>
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  });

  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
