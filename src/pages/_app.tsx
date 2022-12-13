import { AppProps } from 'next/app';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { AuthProvider } from '@/hooks/useAuth';
import { RegisterFlowProvider } from '@/hooks/useRegisterFlow';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RegisterFlowProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </RegisterFlowProvider>
  );
}

export default MyApp;
