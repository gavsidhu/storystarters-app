import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en' className='dark'>
        <Head>
          <link
            rel='preload'
            href='/fonts/inter-var-latin.woff2'
            as='font'
            type='font/woff2'
            crossOrigin='anonymous'
          />
        </Head>
        <Script id='outsetajs'>
          {`var o_options = {
            domain: 'uplevel-hq-llc.outseta.com',
          load: 'support'`}
        </Script>

        <Script
          id='outsetajs2'
          src='https://cdn.outseta.com/outseta.min.js'
          data-options='o_options'
        ></Script>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
