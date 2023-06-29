import '../styles/global.css'
import "prismjs/themes/prism-okaidia.css";
import { ThemeProvider } from "next-themes";
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
