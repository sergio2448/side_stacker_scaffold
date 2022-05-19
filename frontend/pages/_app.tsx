import "../styles/globals.css";
import "../styles/All.css";
import type { AppProps } from "next/app";

// may come in handy i.e. in case you'll want to set up an apollo client subscription etc
const isBrowser = typeof window !== "undefined";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
