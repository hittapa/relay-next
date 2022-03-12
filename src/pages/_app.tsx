import { Provider } from "next-auth/client";
import Head from "next/head";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { getInitialPreloadedQuery, getRelayProps } from "relay-nextjs/app";
import { getClientEnvironment } from "../lib/client_environment";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../components/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles.css";

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment(),
});

function MyApp({ Component, pageProps }) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv;

  return (
    <>
      <Head>
        <title>Align | Interface</title>
      </Head>
      <Provider session={pageProps.session}>
        <RelayEnvironmentProvider environment={env}>
          <ChakraProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
              <Component {...pageProps} {...relayProps} />
            </DndProvider>
          </ChakraProvider>
        </RelayEnvironmentProvider>
      </Provider>
    </>
  );
}

export default MyApp;
