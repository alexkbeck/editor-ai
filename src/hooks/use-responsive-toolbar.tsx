'use client';

import { useEffect, useState } from 'react';

export type ToolbarBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'ultra-wide';

interface ResponsiveToolbarConfig {
  mobile: string[];
  tablet: string[];
  desktop: string[];
  ultraWide: string[];
}

export function useResponsiveToolbar() {
  const [breakpoint, setBreakpoint] = useState<ToolbarBreakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else if (width < 1440) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('ultra-wide');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const getVisibleGroups = (breakpoint: ToolbarBreakpoint): string[] => {
    switch (breakpoint) {
      case 'mobile':
        return ['document-actions', 'content-type', 'basic-formatting'];
      case 'tablet':
        return ['document-actions', 'content-type', 'basic-formatting', 'text-styling', 'paragraph'];
      case 'desktop':
        return ['document-actions', 'content-type', 'basic-formatting', 'text-styling', 'paragraph', 'rich-content'];
      case 'ultra-wide':
        return ['document-actions', 'content-type', 'basic-formatting', 'text-styling', 'paragraph', 'rich-content', 'advanced'];
      default:
        return ['document-actions', 'content-type', 'basic-formatting', 'text-styling', 'paragraph', 'rich-content'];
    }
  };

  const shouldShowMore = (breakpoint: ToolbarBreakpoint): boolean => {
    return breakpoint !== 'ultra-wide';
  };

  return {
    breakpoint,
    visibleGroups: getVisibleGroups(breakpoint),
    shouldShowMore: shouldShowMore(breakpoint),
  };
}