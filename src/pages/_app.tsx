import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { AuthProvider } from '@/hooks/useAuth';
import { ProjectProvider } from '@/hooks/useProjects';
import { RegisterFlowProvider } from '@/hooks/useRegisterFlow';

import AlertState from '@/context/AlertState';
import GlobalDndContext from '@/context/DnDContext';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RegisterFlowProvider>
      <AlertState>
        <AuthProvider>
          <ProjectProvider>
            <GlobalDndContext>
              <Component {...pageProps} />
            </GlobalDndContext>
          </ProjectProvider>
        </AuthProvider>
      </AlertState>
    </RegisterFlowProvider>
  );
}

export default MyApp;
