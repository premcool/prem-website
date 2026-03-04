/**
 * Google Analytics utility functions for tracking events
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Helper functions for common events
export const trackClick = (label: string, category: string = 'engagement') => {
  event({
    action: 'click',
    category,
    label,
  });
};

export const trackDownload = (fileName: string) => {
  event({
    action: 'download',
    category: 'file',
    label: fileName,
  });
};

export const trackShare = (platform: string, contentType: string) => {
  event({
    action: 'share',
    category: 'social',
    label: `${platform}_${contentType}`,
  });
};

export const trackOutboundLink = (url: string) => {
  event({
    action: 'click',
    category: 'outbound',
    label: url,
  });
};
