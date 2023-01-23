import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { AuthProvider } from '@/hooks/useAuth';
import { ProjectProvider } from '@/hooks/useProjects';
import { RegisterFlowProvider } from '@/hooks/useRegisterFlow';

import AlertState from '@/context/AlertState';
import GlobalDndContext from '@/context/DnDContext';

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
