import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { AuthProvider } from '@/hooks/useAuth';
import { ProjectProvider } from '@/hooks/useProjects';
import { RegisterFlowProvider } from '@/hooks/useRegisterFlow';

import GlobalDndContext from '@/context/DnDContext';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RegisterFlowProvider>
      <AuthProvider>
        <ProjectProvider>
          <GlobalDndContext>
            <Component {...pageProps} />
          </GlobalDndContext>
        </ProjectProvider>
      </AuthProvider>
    </RegisterFlowProvider>
  );
}

export default MyApp;
