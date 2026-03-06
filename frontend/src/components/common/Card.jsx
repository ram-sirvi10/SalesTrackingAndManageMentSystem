const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl border border-secondary-200 shadow-soft
        ${hover ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
