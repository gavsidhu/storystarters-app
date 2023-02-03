export const GA_TRACKING_ID = process.env
  .NEXT_PUBLIC_GA_MEASUREMENT_ID as string;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: Gtag.EventNames,
  { event_category, event_label, value }: Gtag.EventParams
) => {
  window.gtag('event', action, {
    event_category,
    event_label,
    value,
  });
};

export const initiateCheckout = () => {
  window.gtag('event', 'conversion', {
    send_to: 'AW-11009471108/A55zCK__qIoYEITl3IEp',
    value: 1.0,
    currency: 'USD',
  });
};
