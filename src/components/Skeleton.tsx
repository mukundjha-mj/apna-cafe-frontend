import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  borderRadius, 
  className = '', 
  style 
}) => {
  const baseStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: borderRadius || 'var(--radius-sm)',
    ...style
  };

  return <div className={`skeleton-shimmer ${className}`} style={baseStyle} />;
};

export default Skeleton;
