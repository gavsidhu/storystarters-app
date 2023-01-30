import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

import '@/styles/globals.css';

import { AuthProvider } from '@/hooks/useAuth';
import { ProjectProvider } from '@/hooks/useProjects';
import { RegisterFlowProvider } from '@/hooks/useRegisterFlow';

import AlertState from '@/context/AlertState';
import GlobalDndContext from '@/context/DnDContext';

import * as gtag from '../lib/gtag';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID as string });
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${
          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string
        }`}
        strategy='afterInteractive'
      />
      <Script id='twitter-pixel' strategy='afterInteractive'>
        {`
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','ochls');
        `}
      </Script>
      <Script id='facebook-pixel' strategy='afterInteractive'>
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '617276536747014');
          fbq('track', 'PageView');
        `}
      </Script>
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string
          }');
          gtag('config', 'AW-11009471108');
        `}
      </Script>
      {/* <Script id="rewardful-snippet" strategy="afterInteractive">
        {`
              (function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
            `}
      </Script>
      <Script async src='https://r.wdfl.co/rw.js' data-rewardful='788d9b' strategy="afterInteractive" /> */}
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
    </>
  );
}

export default MyApp;
