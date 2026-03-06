import { FileX } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = FileX,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
  actionLabel = 'Add New'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-secondary-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 text-center max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
