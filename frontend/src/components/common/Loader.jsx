const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  const loader = (
    <div className="flex justify-center items-center p-6">
      <div className={`${sizes[size]} border-primary-600 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className={`${sizes.lg} border-primary-600 border-t-transparent rounded-full animate-spin mx-auto`}></div>
          <p className="mt-4 text-secondary-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return loader;
};

export default Loader;
