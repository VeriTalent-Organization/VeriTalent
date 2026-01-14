import React from 'react';
import { cn } from '@/lib/utils'; 


type MaxWidthContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Optional: control padding on small screens */
  paddingX?: 'px-4' | 'px-6' | 'px-8' | 'none';
  /** Optional: larger max-width for dashboards or full-width sections */
  large?: boolean;
};

const MaxWidthContainer: React.FC<MaxWidthContainerProps> = ({
  children,
  className,
  paddingX = 'px-4',
  large = false,
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full pb-10',
        paddingX === 'none' ? '' : `${paddingX} sm:${paddingX.replace('px-', 'px-')} md:px-8`,
        large ? 'max-w-7xl' : 'max-w-5xl', // 1280px or 1024px
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthContainer;