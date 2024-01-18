import { SWRConfig } from 'swr/_internal';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import useUser from '@libs/client/useUser';

function MyApp({ Component, pageProps }: AppProps) {
  const { user, isLoading } = useUser();

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
