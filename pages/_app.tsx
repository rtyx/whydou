import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ScoreProvider} from "../contexts/ScoreContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ScoreProvider>
        <Component {...pageProps} />
      </ScoreProvider>
  )

}

export default MyApp
