'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const viewportHeight = window.innerHeight;
      const topZoneHeight = viewportHeight * 0.16;

      if (e.clientY <= topZoneHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <Toolbar
        {...props}
        className={cn(
          'bg-white rounded-lg border shadow-2xl p-3 backdrop-blur-sm',
          'transform transition-all duration-300 ease-in-out',
          'min-w-fit max-w-4xl',
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-90',
          props.className
        )}
      />
    </div>
  );
}
