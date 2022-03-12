import Document, { Html, Head, Main, NextScript } from "next/document";
import { createRelayDocument } from "relay-nextjs/document";
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const relayDocument = createRelayDocument();

    const renderPage = ctx.renderPage;
    ctx.renderPage = () =>
      renderPage({
        enhanceApp: (App) => relayDocument.enhance(App),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      relayDocument,
    };
  }

  render() {
    const { relayDocument } = this.props as any;

    return (
      <Html>
        <Head>
          <relayDocument.Script />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
            rel="stylesheet"
          />
          <link rel="shortcut icon" href="/images/align3_favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
