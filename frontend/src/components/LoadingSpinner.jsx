const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-4 border-farm-200 border-t-farm-600 rounded-full animate-spin`}
    />
  );
};

export default LoadingSpinner;
