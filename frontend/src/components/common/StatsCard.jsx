import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon,
  trend,
  trendValue,
  color = 'primary'
}) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
  };

  const isPositive = trend === 'up';

  return (
    <div className="bg-white rounded-xl border border-secondary-200 p-6 shadow-soft hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-secondary-900 mb-2">{value}</h3>
          
          {trendValue && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trendValue}</span>
              <span className="text-secondary-500 font-normal">vs last month</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
